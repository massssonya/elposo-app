import type { ModifierType } from './menu';

export enum OrderStatus {
  DRAFT = 'DRAFT',               // Черновик (заказ только открыт, ни одно блюдо еще не отправлено на кухню)
  IN_PROGRESS = 'IN_PROGRESS',   // В работе (хотя бы одно блюдо отправлено на кухню, идет процесс готовки/выноса)
  BILL_PRINTED = 'BILL_PRINTED', // Распечатан предчек (стол попросил счет, заказ заблокирован для изменений)
  PAID = 'PAID',                 // Оплачен (финал жизненного цикла, стол закрыт)
  CANCELLED = 'CANCELLED',       // Отменен (ошибочный ввод, отмена администратором)
}

export enum OrderItemStatus {
  DRAFT = 'DRAFT', // Черновик
  SENT_TO_KITCHEN = 'SENT_TO_KITCHEN', // Блюдо отправлено на кухню
  READY = 'READY', // Блюдо готово к выдаче
  SERVED = 'SERVED', // Блюдо подано гостю
  CANCELLED = 'CANCELLED' // Блюдо отменено/удалено из заказа
}

export interface OrderItem {
    id: string;         
    menuItemId: string; 
    name: string;
    price: number;
    quantity: number;
    guestId: string;
    comment?: string;
    modifiers?: OrderItemModifier[];
    status: OrderItemStatus;
  }

export interface OrderGuest {
  id: string;
  name: string;
}

export interface OrderItemModifier {
  id: string;
  name: string;
  price: number;
  type: ModifierType;
}