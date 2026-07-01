import { Order, OrderStatus, OrderItemStatus } from '@shared/types/orders';

export class OrderValidator {
  static canAddItem(order: Order): boolean {
    return order.status === OrderStatus.DRAFT || order.status === OrderStatus.IN_PROGRESS;
  }

  static canRemoveItem(order: Order, itemId: string): { isValid: boolean; reason?: string } {
    const orderItem = order.items.find(item => item.id === itemId);
    if (!orderItem) {
      return { isValid: false, reason: 'Блюдо не найдено' };
    }

    if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.IN_PROGRESS) {
      return { isValid: false, reason: `Нельзя удалить блюдо в статусе: ${order.status}` };
    }

    if (orderItem.status !== OrderItemStatus.DRAFT) {
      return { isValid: false, reason: 'Нельзя удалить блюдо, которое уже отправлено на кухню' };
    }

    return { isValid: true };
  }

  static canUpdateOrderItemQuantity(
    order: Order, 
    itemId: string, 
    delta: number
  ): { isValid: boolean; reason?: string } {
    const orderItem = order.items.find(item => item.id === itemId);
    if (!orderItem) {
      return { isValid: false, reason: 'Блюдо не найдено' };
    }

    if (delta === 0) {
      return { isValid: false, reason: 'Изменение количества должно быть ненулевым' };
    }

    const newQuantity = orderItem.quantity + delta;
    if (newQuantity < 0) {
      return { isValid: false, reason: `Количество не может быть отрицательным (стало: ${newQuantity})` };
    }

    if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.IN_PROGRESS) {
      return { isValid: false, reason: `Нельзя изменить количество в статусе: ${order.status}` };
    }

    if (orderItem.status !== OrderItemStatus.DRAFT) {
      return { isValid: false, reason: `Нельзя изменить блюдо в статусе: ${orderItem.status}` };
    }

    return { isValid: true };
  }

  static canTransferOrder(sourceOrder: Order | undefined): { isValid: boolean; reason?: string } {
    if (!sourceOrder) {
      return { isValid: false, reason: 'Нет заказа для переноса' };
    }

    if (sourceOrder.items.length === 0) {
      return { isValid: false, reason: 'Нельзя перенести пустой заказ' };
    }

    if (sourceOrder.status === OrderStatus.PAID || sourceOrder.status === OrderStatus.CANCELLED) {
      return { 
        isValid: false, 
        reason: `Нельзя перенести заказ в статусе: ${sourceOrder.status}` 
      };
    }

    return { isValid: true };
  }

  static canTransferToTable(
    targetOrder: Order | undefined,
    toTableId: string
  ): { isValid: boolean; reason?: string } {
    if (targetOrder && targetOrder.status === OrderStatus.PAID) {
      return { 
        isValid: false, 
        reason: `Нельзя перенести заказ на стол с оплаченным заказом` 
      };
    }
    return { isValid: true };
  }
}