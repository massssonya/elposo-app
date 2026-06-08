import dynamic from 'next/dynamic';

const DynamicOrderConstructor = dynamic(
  () => import('@terminal/components/OrderConstructor'),
  {
    ssr: false,
    loading: () => (
      <div>
        Загрузка конструктора заказа...
      </div>
    ),
  }
);

export default function OrderPage() {
  return (
    <main>
      <DynamicOrderConstructor />
    </main>
  );
}
