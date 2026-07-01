import { MenuItem } from '@shared/types/menu';
import { OrderItem, OrderGuest, OrderStatus } from '@shared/types/orders';

export interface TableOrder {
  id: string;          
  tableId: string;     
  status: OrderStatus; 
  items: OrderItem[];  
  createdAt: number;   
}

export interface OrderSlice {
  ordersByTable: Record<string, Order | undefined>;

  getTableItems: (tableId: string) => OrderItem[];
  getOrderStatus: (tableId: string) => OrderStatus;
  getOrderByTable: (tableId: string) => Order | undefined;

  initTableOrder: (tableId: string) => void;
  
  addOrderItem: (
    tableId: string, 
    menuItem: MenuItem, 
    guestId: string, 
    selectedModifiers?: OrderItemModifier[]
  ) => void;
  removeOrderItem: (tableId: string, orderItemId: string) => void;
  updateOrderItem: (payload: UpdateOrderItemPayload) => void;
  updateOrderItemQuantity: (tableId: string, orderItemId: string, delta: number) => void;
  updateOrderItemComment: (tableId: string, orderItemId: string, comment: string) => void;
  updateOrderItemStatus: (tableId: string, itemIds: string[], newStatus: OrderItemStatus) => void;
  
  updateOrder: (tableId: string, updates: OrderUpdate) => void;
  updateOrderStatus: (tableId: string, status: OrderStatus) => void;
  clearOrder: (tableId: string) => void;
  removeOrderFromTable: (tableId: string) => void; 

  mergeOrdersData: (
    targetTableId: string,
    sourceOrder: Order,
    guestIdMap: Record<string, string>
  ) => Order;
  prepareOrderForTransfer: (tableId: string) => {
    order: Order;
    guests: OrderGuest[];
  } | null;
}

export interface GuestSlice {
  guestsByTable: Record<string, OrderGuest[]>;
  activeGuestIdByTable: Record<string, string>;
  
  getTableGuests: (tableId: string) => OrderGuest[];
  getGuestById: (tableId: string, guestId: string) => OrderGuest | undefined;
  setActiveGuest: (tableId: string, guestId: string) => void;
  addGuestToTable: (tableId: string) => string;
  removeGuestFromTable: (tableId: string, guestId: string) => void;
  updateGuestsForTable: (tableId: string, guests: OrderGuest[]) => void;
  removeGuestsFromTable: (tableId: string) => void;
  
  prepareGuestRemoval: (tableId: string, guestId: string) => {
    updatedGuests: OrderGuest[];
    removedGuest: OrderGuest | undefined;
  } | null;
}

export type OrderStoreState = OrderSlice & GuestSlice;
