import { Order, OrderItem, OrderItemModifier, OrderStatus, OrderItemStatus, MenuItem, OrderGuest } from '@shared/types/orders';

export class OrderService {
  static createOrder(tableId: string, guests: OrderGuest[]): Order {
    return {
      id: `ord_${Date.now()}`,
      tableId,
      status: OrderStatus.DRAFT,
      items: [],
      guests,
      bills: [],
      createdAt: Date.now(),
    };
  }

  static addItem(
    order: Order, 
    menuItem: MenuItem, 
    guestId: string, 
    selectedModifiers: OrderItemModifier[] = []
  ): Order {
    if (!order) throw new Error('Заказ не найден');
    
    const existingItem = this.findExistingItem(order.items, menuItem.id, guestId, selectedModifiers);
    
    let newItems: OrderItem[];
    if (existingItem) {
      newItems = this.incrementItemQuantity(order.items, existingItem.id);
    } else {
      const newItem = this.createOrderItem(menuItem, guestId, selectedModifiers);
      newItems = [...order.items, newItem];
    }

    return { ...order, items: newItems };
  }

  static removeItem(order: Order, itemId: string): Order {
    if (!order) throw new Error('Заказ не найден');
    
    const itemExists = order.items.some(item => item.id === itemId);
    if (!itemExists) throw new Error('Блюдо не найдено');

    return {
      ...order,
      items: order.items.filter(item => item.id !== itemId)
    };
  }

  static updateQuantity(order: Order, itemId: string, delta: number): {
    order: Order;
    wasRemoved: boolean;
    oldQuantity: number;
    newQuantity: number;
  } {
    if (!order) throw new Error('Заказ не найден');
    
    const itemIndex = order.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) throw new Error('Блюдо не найдено');

    const oldQuantity = order.items[itemIndex].quantity;
    const newQuantity = oldQuantity + delta;

    if (newQuantity < 0) throw new Error('Количество не может быть отрицательным');

    let updatedOrder: Order;
    let wasRemoved = false;

    if (newQuantity === 0) {
      updatedOrder = {
        ...order,
        items: order.items.filter(item => item.id !== itemId)
      };
      wasRemoved = true;
    } else {
      updatedOrder = {
        ...order,
        items: order.items.map((item, index) =>
          index === itemIndex ? { ...item, quantity: newQuantity } : item
        )
      };
    }

    return {
      order: updatedOrder,
      wasRemoved,
      oldQuantity,
      newQuantity
    };
  }

  static updateComment(order: Order, itemId: string, comment: string): Order {
    if (!order) throw new Error('Заказ не найден');
    
    const itemExists = order.items.some(item => item.id === itemId);
    if (!itemExists) throw new Error('Блюдо не найдено');

    return {
      ...order,
      items: order.items.map(item =>
        item.id === itemId ? { ...item, comment } : item
      )
    };
  }

  static updateItemStatus(order: Order, itemIds: string[], newStatus: OrderItemStatus): Order {
    return {
      ...order,
      items: order.items.map(item =>
        itemIds.includes(item.id) ? { ...item, status: newStatus } : item
      )
    };
  }

  static mergeOrders(
    targetOrder: Order | undefined,
    sourceOrder: Order,
    guestIdMap: Record<string, string>
  ): Order {
    if (!targetOrder) {
      return {
        id: `ord_${Date.now()}`,
        tableId: sourceOrder.tableId,
        status: sourceOrder.status,
        items: this.remapOrderItems(sourceOrder.items, guestIdMap),
        guests: [],
        bills: [],
        createdAt: Date.now(),
      };
    }

    const mergedItems = this.mergeOrderItems(
      targetOrder.items,
      sourceOrder.items,
      guestIdMap
    );

    return {
      ...targetOrder,
      items: mergedItems,
      status: targetOrder.status || sourceOrder.status,
    };
  }

  static remapOrderItems(
    items: OrderItem[],
    guestIdMap: Record<string, string>
  ): OrderItem[] {
    return items.map(item => ({
      ...item,
      guestId: guestIdMap[item.guestId] || item.guestId
    }));
  }

  private static mergeOrderItems(
    targetItems: OrderItem[],
    sourceItems: OrderItem[],
    guestIdMap: Record<string, string>
  ): OrderItem[] {
    const mergedItems = [...targetItems];

    sourceItems.forEach((sourceItem) => {
      const remappedGuestId = guestIdMap[sourceItem.guestId] || sourceItem.guestId;
      
      const existingItem = mergedItems.find(
        (item) => 
          item.menuItemId === sourceItem.menuItemId && 
          item.guestId === remappedGuestId &&
          this.areModifiersEqual(item.modifiers, sourceItem.modifiers)
      );

      if (existingItem) {
        existingItem.quantity += sourceItem.quantity;
      } else {
        mergedItems.push({
          ...sourceItem,
          guestId: remappedGuestId
        });
      }
    });

    return mergedItems;
  }

  private static findExistingItem(
    items: OrderItem[], 
    menuItemId: string, 
    guestId: string, 
    modifiers: OrderItemModifier[] = []
  ) {
    return items.find(
      item => 
        item.menuItemId === menuItemId && 
        item.guestId === guestId &&
        this.areModifiersEqual(item.modifiers, modifiers)
    );
  }

  private static areModifiersEqual(
    mods1: OrderItemModifier[] = [], 
    mods2: OrderItemModifier[] = []
  ): boolean {
    if (mods1.length !== mods2.length) return false;
    const ids1 = mods1.map(m => m.id).sort();
    const ids2 = mods2.map(m => m.id).sort();
    return ids1.every((id, index) => id === ids2[index]);
  }

  private static incrementItemQuantity(items: OrderItem[], itemId: string): OrderItem[] {
    return items.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  private static createOrderItem(
    menuItem: MenuItem, 
    guestId: string, 
    modifiers: OrderItemModifier[] = []
  ): OrderItem {
    const modifiersSum = modifiers.reduce((sum, m) => sum + m.price, 0);
    return {
      id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price + modifiersSum,
      quantity: 1,
      guestId,
      modifiers: modifiers.length > 0 ? modifiers : undefined,
      status: OrderItemStatus.DRAFT
    };
  }
}