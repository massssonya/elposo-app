import React from 'react';
import dynamic from 'next/dynamic';

const DynamicTerminalContent = dynamic(
  () => import('@terminal/components/TerminalContent'),
  {
    ssr: false,
    loading: () => (
      <span>
          Загрузка интерфейса терминала...
      </span>
    ),
  }
);

export default function TerminalPage() {
  return (
    <main>
      <DynamicTerminalContent />
    </main>
  );
}
