import { useOrderStore } from '@shared/stores/orderStore';
import { OrderFacade } from '@shared/facades';

let facadeInstance: OrderFacade | null = null;

export const useOrderFacade = () => {
  if (!facadeInstance) {
    facadeInstance = new OrderFacade(
      () => useOrderStore.getState(),
      (fn) => useOrderStore.setState(fn)
    );
  }
  return facadeInstance;
};