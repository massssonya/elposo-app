'use client';

import { useRouter } from 'next/navigation';

import { Permission } from '@shared/types/auth';
import { getRedirectPath } from '@shared/utils/getRedirectPath';
import { AuthScreen } from '@shared/components/AuthScreen';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccessAuth = (permissions: Permission[]) => {
    const targetPath = getRedirectPath(permissions);

    if (targetPath) {
      router.push(targetPath);
    } else {
      console.error('У пользователя нет разрешений для входа в интерфейсы');
      alert('Ошибка доступа: обратитесь к системному администратору');
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <AuthScreen onSuccessRedirect={handleSuccessAuth} />
    </main>
  );
}
