export const ROUTES = {
  AUTH: {
    LOGIN: '/',
  },
  TERMINAL: {
    MAIN: '/terminal',
    TABLES: '/terminal/tables',
    ORDER: (id: string) => `/terminal/orders/${id}`,
  },
  KITCHEN: {
    MAIN: '/kitchen',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    STOCK: '/admin/stock',
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
  },
} as const;

export type AppRoutes = typeof ROUTES;
