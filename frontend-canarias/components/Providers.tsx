"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

/*
  Providers centraliza todo lo que necesita estar
  disponible globalmente en la app.

  Está separado del layout.tsx porque layout.tsx es
  un Server Component por defecto en Next.js 14.
  Todo lo que use hooks o estado tiene que ser "use client".

  Agregá acá cualquier provider nuevo que necesites
  en el futuro (ej: ThemeProvider, SessionProvider, etc.)
*/

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Los datos se consideran frescos por 1 minuto.
        // Durante ese tiempo no hace un refetch aunque
        // el usuario cambie de pantalla y vuelva.
        staleTime: 1000 * 60,

        // Reintenta 1 vez si falla (por defecto reintenta 3)
        retry: 1,

        // Refresca automáticamente cuando el usuario
        // vuelve a la pestaña del navegador
        refetchOnWindowFocus: true,
      },
      mutations: {
        // No reintenta mutaciones fallidas por defecto
        // (no querés que un pago se envíe dos veces)
        retry: 0,
      },
    },
  });
}

// Se crea el QueryClient fuera del componente para evitar
// que se recree en cada render. En Next.js con SSR
// esto necesita el patrón con useState para que cada
// request del servidor tenga su propia instancia.
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: siempre crea un cliente nuevo
    return makeQueryClient();
  }
  // Browser: reutiliza el cliente existente
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // useState garantiza que el QueryClient no se recrea en cada render
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Toaster para notificaciones globales (éxito, error, etc.) */}
      <Toaster position="top-right" richColors closeButton />

      {/* DevTools solo en desarrollo — desaparece en producción */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
