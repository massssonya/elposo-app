import { User } from '@shared/types/auth';

export default function Home() {
  const user: User = {
    id: '1',
    name: 'user',
    pinCode: '1111',
    roles: ['waiter'],
    isActive: true,
    permissions: ['orders:create'],
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}

{
  /* <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            /> */
}
