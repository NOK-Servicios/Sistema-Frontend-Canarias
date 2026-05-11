import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
  Store global de autenticación con Zustand.
 
  "persist" guarda el estado en localStorage automáticamente.
  Cuando el usuario recarga la página, el estado se restaura solo.
 
  Guardamos el usuario y el rol, pero NO el token acá —
  el token vive en localStorage por separado y lo maneja api.ts.
*/

export type Rol = "administrativo" | "vendedor" | "cobrador" | "gerente";

export interface UsuarioActual {
  id: string;
  name: string;
  email: string;
  role: Rol;
  societyId: string;
}

interface AuthState {
  usuario: UsuarioActual | null;
  isAuthenticated: boolean;

  // Acciones
  setUsuario: (usuario: UsuarioActual) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      isAuthenticated: false,

      setUsuario: (usuario) => set({ usuario, isAuthenticated: true }),

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ usuario: null, isAuthenticated: false });
        window.location.href = "/login";
      },
    }),
    {
      name: "canarias-auth", // nombre de la key en localStorage
      // Solo persistimos lo necesario — no las funciones
      partialize: (state) => ({
        usuario: state.usuario,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// ─── HELPERS DE ROL ──────────────────────────────────────────────────────────
// Usá estos hooks en componentes para verificar permisos.

export function useRol() {
  return useAuthStore((s) => s.usuario?.role);
}

export function useEsAdmin() {
  return useAuthStore((s) => s.usuario?.role === "administrativo");
}

export function useEsGerente() {
  return useAuthStore((s) => s.usuario?.role === "gerente");
}

export function useEsCobrador() {
  return useAuthStore((s) => s.usuario?.role === "cobrador");
}

export function useEsVendedor() {
  return useAuthStore((s) => s.usuario?.role === "vendedor");
}
