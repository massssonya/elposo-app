import { OrderStoreState } from '@shared/store/types';
import { OrderService } from '@shared/services/order-service';
import { GuestService } from '@shared/services/guest-service';
import { OrderValidator } from '@shared/validators';
import { Order, OrderStatus } from '@shared/types/orders';

export class OrderFacade {
  constructor(
    private getState: () => OrderStoreState,
    private setState: (fn: (state: OrderStoreState) => Partial<OrderStoreState>) => void
  ) {}

  transferOrder(fromTableId: string, toTableId: string) {
    const state = this.getState();
    
    const sourceData = state.prepareOrderForTransfer(fromTableId);
    if (!sourceData) {
      console.warn('Нет заказа для переноса');
      return;
    }

    const { order: sourceOrder, guests: sourceGuests } = sourceData;
    const targetOrder = state.getOrderByTable(toTableId);
    const targetGuests = state.getTableGuests(toTableId);

    const validation = OrderValidator.canTransferOrder(sourceOrder);
    if (!validation.isValid) {
      console.warn(validation.reason);
      return;
    }

    if (fromTableId === toTableId) {
      console.warn('Нельзя перенести заказ на тот же стол');
      return;
    }

    try {
      const { remappedGuests, guestIdMap } = GuestService.remapGuests(
        sourceGuests,
        targetGuests
      );

      const finalGuests = GuestService.mergeGuests(targetGuests, remappedGuests);
      
      const mergedOrder = state.mergeOrdersData(
        toTableId,
        sourceOrder,
        guestIdMap
      );

      state.updateGuestsForTable(toTableId, finalGuests);
      state.removeGuestsFromTable(fromTableId);
      state.removeOrderFromTable(fromTableId);

      console.log(`✅ Заказ перенесен со стола ${fromTableId} на стол ${toTableId}`);
    } catch (error) {
      console.error('❌ Ошибка при переносе заказа:', error);
    }
  }

  removeGuestWithItems(tableId: string, guestId: string) {
    const state = this.getState();
    
    const order = state.getOrderByTable(tableId);
    if (!order) {
      console.warn('Заказ не найден');
      return;
    }

    const guests = state.getTableGuests(tableId);
    const hasItems = order.items.some(item => item.guestId === guestId);
    
    if (hasItems && order.status !== OrderStatus.DRAFT) {
      console.warn('Нельзя удалить гостя с блюдами, если заказ уже отправлен на кухню');
      return;
    }

    try {
      state.removeGuestFromTable(tableId, guestId);
      
      if (hasItems) {
        const itemsToRemove = order.items
          .filter(item => item.guestId === guestId)
          .map(item => item.id);
        
        itemsToRemove.forEach(itemId => {
          state.removeOrderItem(tableId, itemId);
        });
      }

      console.log(`✅ Гость ${guestId} удален со стола ${tableId}`);
    } catch (error) {
      console.error('❌ Ошибка при удалении гостя:', error);
    }
  }

  splitOrderByGuests(tableId: string) {
    const state = this.getState();
    const order = state.getOrderByTable(tableId);
    
    if (!order) {
      console.warn('Заказ не найден');
      return;
    }

    const itemsByGuest = order.items.reduce((acc, item) => {
      if (!acc[item.guestId]) {
        acc[item.guestId] = [];
      }
      acc[item.guestId].push(item);
      return acc;
    }, {} as Record<string, OrderItem[]>);

    const guestIds = Object.keys(itemsByGuest);
    
    if (guestIds.length <= 1) {
      console.warn('Невозможно разделить заказ - только один гость');
      return;
    }

    console.log(`✅ Заказ разделен на ${guestIds.length} частей`);
  }

  
  addItemWithValidation(tableId: string, menuItem: any, guestId: string) {
    const state = this.getState();
    
    let order = state.getOrderByTable(tableId);
    if (!order) {
      const defaultGuests = state.getTableGuests(tableId);
      state.initTableOrderWithGuests(tableId, defaultGuests);
    }
    
    state.addOrderItem(tableId, menuItem, guestId);
  }

  bulkAddItems(tableId: string, items: Array<{ menuItem: any; guestId: string; modifiers?: any[] }>) {
    const state = this.getState();
    
    let order = state.getOrderByTable(tableId);
    if (!order) {
      const defaultGuests = state.getTableGuests(tableId);
      state.initTableOrderWithGuests(tableId, defaultGuests);
    }
    
    items.forEach(({ menuItem, guestId, modifiers = [] }) => {
      state.addOrderItem(tableId, menuItem, guestId, modifiers);
    });
  }

  bulkRemoveItems(tableId: string, itemIds: string[]) {
    const state = this.getState();
    
    itemIds.forEach(itemId => {
      state.removeOrderItem(tableId, itemId);
    });
  }
}