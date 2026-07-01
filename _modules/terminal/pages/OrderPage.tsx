'use client';
import { useParams } from 'next/navigation';

import OrderConstructor from '@terminal/components/OrderConstructor';

interface OrderPageProps {
  tableId: string;
}

export default function OrderPage({ tableId }: OrderPageProps) {
  const params = useParams();
  const id = params.id as string;
  
  return <OrderConstructor tableId={tableId} />;
}