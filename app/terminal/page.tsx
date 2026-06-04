'use client';

import { ActivityProvider } from '@shared/providers/ActivityProvider';
import { TableGrid } from "@terminal/components/TableGrid"

export default function TerminalPage() {
  return (
  <main className="min-h-screen ">
    <ActivityProvider timeoutMs={100000}>
      <TableGrid />
    </ActivityProvider>
  </main>);
}
