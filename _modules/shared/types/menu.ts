export interface MenuItem {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    imageUrl?: string;
    isAvailable: boolean; // Для стоп-листов
  }
  
export interface MenuCategory {
    id: string;
    name: string;
    icon?: string;
  }
  