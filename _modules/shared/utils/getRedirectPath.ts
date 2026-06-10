import { ROUTES } from '../constants/routes';
import { Permission } from '../types/auth';

export function getRedirectPath(permissions: Permission[]): string | null {
  // 1. Управляющий / Администратор
  if (
    permissions.includes('admin:reports') ||
    permissions.includes('admin:users')
  ) {
    return ROUTES.ADMIN.DASHBOARD();
  }

  // 2. Фронт-офис (Официант / Бармен / Кассир)
  if (
    permissions.includes('orders:create') ||
    permissions.includes('cash:pay')
  ) {
    return ROUTES.TERMINAL.MAIN();
  }

  // 3. Производство (Повар)
  if (permissions.includes('kitchen:view')) {
    return ROUTES.KITCHEN.MAIN();
  }

  // Если у пользователя нет никаких прав для входа в интерфейсы
  return null;
}
