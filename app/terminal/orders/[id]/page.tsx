'use client';

import { OrderConstructor } from '@terminal/components/OrderConstructor';

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Тонкий роутер просто вызывает модуль */}
      <OrderConstructor />
    </main>
  );
}
