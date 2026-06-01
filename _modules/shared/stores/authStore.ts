import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Permission, User } from '../types/auth';
import mockUsers from '/public/users.json';

interface AuthState {
  user: User | null;
  isAuth: boolean;

  authByPin: (pin: string) => { success: boolean; error?: string };
  logout: () => void;

  checkPermission: (permission: Permission) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuth: false,
      authByPin: (pin) => {
        const foundUser = (mockUsers as User[]).find(
          (u) => u.pinCode === pin
        ) as User | undefined;

        if (!foundUser) {
          return { success: false, error: 'Неверный ПИН-код' };
        }

        if (!foundUser.isActive) {
          return { success: false, error: 'Сотрудник заблокирован' };
        }

        set({ user: foundUser, isAuth: true });
        return { success: true };
      },
      logout: () => {
        set({ user: null, isAuth: false });
      },
      checkPermission: (permission) => {
        const user = get().user;
        if (!user || !user.isActive) return false;
        return user.permissions.includes(permission);
      },
    }),
    {
      name: 'pos-session-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              name: state.user.name,
              roles: state.user.roles,
              permissions: state.user.permissions,
            }
          : null,
        isAuth: state.isAuth,
      }),
    }
  )
);
