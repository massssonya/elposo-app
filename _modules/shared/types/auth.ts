export type Permission =
  // Модуль: Терминал / Заказы
  | 'orders:create' // Создание заказа и добавление блюд
  | 'orders:delete_item' // Удаление позиции из заказа (требует прав админа/менеджера)
  | 'orders:discount' // Применение ручных скидок
  | 'orders:split' // Разделение чека между гостями

  // Модуль: Кухня
  | 'kitchen:view' // Просмотр экрана кухни и смена статусов блюд
  | 'kitchen:stop_list' // Добавление блюд в стоп-лист

  // Модуль: Касса и Смены
  | 'cash:open_shift' // Открытие кассовой смены
  | 'cash:close_shift' // Закрытие смены (с уходом Z-отчета)
  | 'cash:pay' // Прием оплаты и фискализация чека

  // Модуль: Склад и Админка
  | 'stock:view' // Просмотр остатков на складе
  | 'stock:manage' // Оприходование, списание, инвентаризация
  | 'admin:users' // Управление персоналом и правами
  | 'admin:reports'; // Просмотр финансовых отчетов и аналитики

export type UserRole = 'waiter' | 'cook' | 'bartender' | 'cashier' | 'manager';

export interface User {
  id: string;
  name: string;
  roles: UserRole[];
  permissions: Permission[];
  pinCode: string; // 4-значный хэш или строка для входа на терминале
  avatarUrl?: string; // Ссылка на фото сотрудника (опционально)
  isActive: boolean; // Статус сотрудника (заблокирован/активен)
}

// const ROLE_TEMPLATES: Record<UserRole, Permission[]> = {};
