export type TableShape = 'rectangle' | 'circle';

export enum TableStatus {
  FREE = 'FREE',
  OCCUPIED = 'OCCUPIED',
  BILL_PAID = 'BILL_PAID',
  CLEANING = 'CLEANING',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export interface Table {
  id: string;
  number: string;
  status: TableStatus;
  capacity: number;
  currentOrderId?: string;
  
  isDynamic: boolean;   
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shape?: TableShape;
}

export interface HallZone {
  id: string;
  name: string;
  isDynamicZone: boolean;
  tables: Table[];
}
