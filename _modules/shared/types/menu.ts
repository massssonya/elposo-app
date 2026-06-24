export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
}
  
export interface MenuCategory {
  id: string;
  name: string;
  icon?: string;
}

export type ModifierType = 'add' | 'remove';
  
export interface Modifier {
  id: string;
  name: string;
  price: number;
  type: ModifierType;
}
  
export interface ModifierGroupType {
  id: string;
  name: string;
  min: number;
  max: number;
  modifierIds: string[];
}