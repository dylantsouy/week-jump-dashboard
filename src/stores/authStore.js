import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
    token: null,
    user: null,
    rememberAccount: '',
    ifRememberAccount: false,
    permissionArray: [],
};

export const useAuthStore = create(
    persist(
        (set) => ({
            ...initialState,
            setAuthValue: (key, value) =>
                set(() => ({
                    [key]: value,
                })),
            clear: () => set(initialState),
            logout: () =>
                set({
                    ...initialState,
                    token: null,
                    user: null,
                }),
        }),
        {
            name: 'auth-stock-dashboard',
            getStorage: () => localStorage,
        }
    )
);