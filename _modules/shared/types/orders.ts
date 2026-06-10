export enum OrderStatus {
    DRAFT = 'DRAFT',                 // Черновик (официант набирает блюда в терминале, кухня о них еще не знает)
    SENT_TO_KITCHEN = 'SENT_TO_KITCHEN', // Отправлен на кухню (встречки распечатались на поварских принтерах / отобразились на KDS)
    READY = 'READY',                 // Готов к выдаче (повара приготовили, нужно забрать с раздачи)
    SERVED = 'SERVED',               // Подан гостю (блюда на столе)
    BILL_PRINTED = 'BILL_PRINTED',   // Распечатан предчек (гости попросили счет, редактирование заказа блокируется)
    PAID = 'PAID',                   // Оплачен (деньги внесены в кассу)
    CANCELLED = 'CANCELLED',         // Отменен (удаление заказа администратором, например, при ложном открытии стола)
  }

export interface OrderItem {
    id: string;         
    menuItemId: string; 
    name: string;
    price: number;
    quantity: number;
    guestId: string;
    comment?: string;
  }

export interface OrderGuest {
  id: string;
  name: string;
} 