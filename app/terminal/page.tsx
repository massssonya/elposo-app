import dynamic from 'next/dynamic';

const DynamicTerminalContent = dynamic(
  () => import('@terminal/components/TerminalContent'),
  {
    ssr: false,
  }
);

export default async function TerminalPage() {
  return (
    <main>
      <DynamicTerminalContent />
    </main>
  );
}
