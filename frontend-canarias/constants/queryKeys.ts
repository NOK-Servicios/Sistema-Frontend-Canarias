/*
  Centralizar las query keys de TanStack Query es una
  buena práctica muy importante.

  Sin esto cada desarrollador escribe las keys a mano
  ("clientes", "Clientes", "cliente") y el caché
  nunca se invalida correctamente.

  Con esto, cuando registrás un pago hacés:
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cuotas.all })
  y todas las queries de cuotas se refrescan.
*/

export const QUERY_KEYS = {
  auth: {
    me: ["auth", "me"] as const,
  },

  clientes: {
    all: ["clientes"] as const,
    lista: (filtros?: Record<string, unknown>) =>
      ["clientes", "lista", filtros] as const,
    detalle: (id: string) => ["clientes", id] as const,
    historial: (id: string) => ["clientes", id, "historial"] as const,
  },

  staff: {
    all: ["staff"] as const,
    detalle: (id: string) => ["staff", id] as const,
    zonas: (id: string) => ["staff", id, "zonas"] as const,
  },

  ventas: {
    all: ["ventas"] as const,
    lista: (filtros?: Record<string, unknown>) =>
      ["ventas", "lista", filtros] as const,
    detalle: (id: string) => ["ventas", id] as const,
  },

  cuotas: {
    all: ["cuotas"] as const,
    // Las cuotas del día del cobrador — se usan mucho
    hoy: (staffId: string) => ["cuotas", "hoy", staffId] as const,
    porCliente: (clienteId: string) =>
      ["cuotas", "cliente", clienteId] as const,
    detalle: (id: string) => ["cuotas", id] as const,
  },

  pagos: {
    all: ["pagos"] as const,
    porVenta: (ventaId: string) => ["pagos", "venta", ventaId] as const,
  },

  caja: {
    all: ["caja"] as const,
    activa: (societyId: string) => ["caja", "activa", societyId] as const,
    movimientos: (cajaId: string) => ["caja", cajaId, "movimientos"] as const,
  },

  productos: {
    all: ["productos"] as const,
    lista: (filtros?: Record<string, unknown>) =>
      ["productos", "lista", filtros] as const,
    detalle: (id: string) => ["productos", id] as const,
  },

  proveedores: {
    all: ["proveedores"] as const,
    detalle: (id: string) => ["proveedores", id] as const,
  },

  reportes: {
    kpis: (societyId: string) => ["reportes", "kpis", societyId] as const,
    cobranza: (filtros: Record<string, unknown>) =>
      ["reportes", "cobranza", filtros] as const,
    ventas: (filtros: Record<string, unknown>) =>
      ["reportes", "ventas", filtros] as const,
  },

  zonas: {
    all: ["zonas"] as const,
    porSociedad: (societyId: string) =>
      ["zonas", "sociedad", societyId] as const,
  },
} as const;
