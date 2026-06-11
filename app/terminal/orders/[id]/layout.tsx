import { Suspense } from 'react';
import { OrderGuard } from '@/app/_components/OrderGuard';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <OrderGuard>
        {children}
      </OrderGuard>
    </Suspense>
  );
}
