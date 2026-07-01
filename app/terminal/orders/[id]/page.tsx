import dynamic from 'next/dynamic';

const OrderPageModule = dynamic(
  () => import('@terminal/pages/OrderPage'),
  {
    ssr: false,
  }
);

export default function OrderPage() {
  
  return (
    <main>
      <OrderPageModule />
    </main>
  );
}