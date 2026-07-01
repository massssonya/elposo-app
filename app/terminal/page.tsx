import dynamic from 'next/dynamic';

const DynamicTerminalPage = dynamic(
  () => import('@terminal/pages/TerminalPage'),
  {
    ssr: false,
  }
);

export default async function TerminalPage() {
  return (
    <main>
      <DynamicTerminalPage />
    </main>
  );
}
