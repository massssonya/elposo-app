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
  ordersByTable: Record<string, TableOrder | null>;
  initTableOrder: (tableId: string) => void;
  addToOrder: (tableId: string, item: MenuItem, guestId: string) => void;
  removeFromOrder: (tableId: string, orderItemId: string) => void;
  updateQuantity: (tableId: string, orderItemId: string, delta: number) => void;
  updateItemComment: (tableId: string, orderItemId: string, comment: string) => void;
  clearOrder: (tableId: string) => void;
  transferOrder: (fromTableId: string, toTableId: string) => void;
  updateOrderStatus: (tableId: string, status: OrderStatus) => void;
  getTableItems: (tableId: string) => OrderItem[];
  getOrderStatus: (tableId: string) => OrderStatus;
}

export interface GuestSlice {
  guestsByTable: Record<string, OrderGuest[]>;
  activeGuestIdByTable: Record<string, string>;
  addGuestToTable: (tableId: string) => string;
  setActiveGuest: (tableId: string, guestId: string) => void;
  getTableGuests: (tableId: string) => OrderGuest[];
  removeGuestFromTable: (tableId: string, guestId: string) => void;
}

export type OrderStoreState = OrderSlice & GuestSlice;
