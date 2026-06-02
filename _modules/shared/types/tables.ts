export type TableShape = 'rectangle' | 'circle';

export interface Table {
  id: string;
  number: string;
  status: 'free' | 'busy' | 'reserved' | 'dirty';
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
