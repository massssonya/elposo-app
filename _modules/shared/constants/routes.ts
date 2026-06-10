const withLoading = (path: string, text?: string) => {
  if (!text) return path;
  return `${path}?loading_text=${encodeURIComponent(text)}`;
};

export const ROUTES = {
  AUTH: {
    LOGIN: '/', 
  },
  TERMINAL: {
    MAIN: () => withLoading('/terminal', 'Загрузка карты залов...'),
    TABLES: (text?: string) => withLoading('/terminal/tables', text),
    ORDER: (id: string, text?: string) => withLoading(`/terminal/orders/${id}`, text),
  },
  KITCHEN: {
    MAIN: () => withLoading('/kitchen', 'Синхронизация экрана поваров...'),
  },
  ADMIN: {
    DASHBOARD: () => withLoading('/admin/dashboard', 'Загрузка панели аналитики...'),
    STOCK: (text?: string) => withLoading('/admin/stock', text),
    USERS: (text?: string) => withLoading('/admin/users', text),
    REPORTS: (text?: string) => withLoading('/admin/reports', text),
  },
} as const;

export type AppRoutes = typeof ROUTES;
