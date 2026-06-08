'use client';

import { ActivityProvider } from '@shared/providers/ActivityProvider';
import { TableGrid } from "../TableGrid"

export default function TerminalContent() {
  return (
    <ActivityProvider timeoutMs={100000}>
      <TableGrid />
    </ActivityProvider>
    );
}
