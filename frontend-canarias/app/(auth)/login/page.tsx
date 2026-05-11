/*
  Esta es la página de login de Next.js App Router.
  Es un Server Component — no tiene lógica de cliente.
  Solo renderiza el formulario que sí es Client Component.

  URL: /login
*/

export default function LoginPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* ── Panel izquierdo: marca Canarias ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{ backgroundColor: "#1B4F8A" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: "#F5A623" }}
          >
            C
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Canarias Equipamientos
          </span>
        </div>

        {/* Quote central */}
        <div>
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed mb-6">
            &quot;Control financiero en tiempo real para tu negocio&quot;
          </blockquote>
          <div className="flex gap-6 text-white/60 text-sm">
            <span>Gestión de cobranza</span>
            <span>·</span>
            <span>Ventas a crédito</span>
            <span>·</span>
            <span>Reportes ejecutivos</span>
          </div>
        </div>

        {/* Footer panel */}
        <p className="text-white/40 text-xs">
          © 2026 Canarias S.R.L. — Sistema desarrollado por Infinity Software
        </p>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo mobile (solo se muestra en pantallas chicas) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "#1B4F8A" }}
            >
              C
            </div>
            <span className="font-semibold text-gray-900">
              Canarias Equipamientos
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Bienvenido
            </h1>
            <p className="text-gray-500 text-sm">
              Ingresá tus credenciales para continuar
            </p>
          </div>

          {/* <LoginForm /> */}
        </div>
      </div>
    </main>
  );
}
