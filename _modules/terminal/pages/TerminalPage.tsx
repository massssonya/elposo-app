'use client';

import { ActivityProvider } from '@shared/providers/ActivityProvider';
import { HallMap } from "@terminal/components/HallMap"

export default function TerminalPage() {
  return (
    <ActivityProvider timeoutMs={100000}>
      <HallMap />
    </ActivityProvider>
  );
}