import dynamic from 'next/dynamic';

const DynamicOrderConstructor = dynamic(
  () => import('@terminal/components/OrderConstructor'),
  {
    ssr: false,
  }
);

export default async function OrderPage() {
  return (
    <main>
      <DynamicOrderConstructor />
    </main>
  );
}
