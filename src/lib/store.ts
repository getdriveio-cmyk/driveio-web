
'use client';

import { create } from 'zustand';
import type { DateRange } from 'react-day-picker';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    isHost: boolean;
    isAdmin?: boolean;
}

interface SearchState {
  location: string;
  dateRange: DateRange | undefined;
  setLocation: (location: string) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      location: '',
      dateRange: undefined,
      setLocation: (location) => set({ location }),
      setDateRange: (dateRange) => set({ dateRange }),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage
    }
  )
);


interface FavoriteState {
    favorites: string[];
    toggleFavorite: (vehicleId: string) => void;
    isFavorite: (vehicleId: string) => boolean;
}

export const useFavoriteStore = create(
    persist<FavoriteState>(
        (set, get) => ({
            favorites: [],
            toggleFavorite: (vehicleId: string) => {
                set((state) => {
                    const isFavorited = state.favorites.includes(vehicleId);
                    if (isFavorited) {
                        return { favorites: state.favorites.filter((id) => id !== vehicleId) };
                    } else {
                        return { favorites: [...state.favorites, vehicleId] };
                    }
                });
            },
            isFavorite: (vehicleId: string) => {
                return get().favorites.includes(vehicleId);
            }
        }),
        {
            name: 'favorite-vehicles-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

interface AuthState {
    isLoggedIn: boolean;
    user: AuthUser | null;
    isHydrating: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
}

const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            isLoggedIn: false,
            user: null,
            isHydrating: true,
            login: (user) => set({ isLoggedIn: true, user }),
            logout: () => set({ isLoggedIn: false, user: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isHydrating = false;
                }
            },
        }
    )
);

// Custom hook to safely access the store's state after hydration
export const useAuth = () => {
    const state = useAuthStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    // Return a default state on the server until the store is hydrated on the client
    if (!hydrated) {
       return { 
           isLoggedIn: false, 
           user: null, 
           isHydrating: true,
           login: () => {}, 
           logout: () => {} 
        };
    }

    return state;
};


// Expose the entire state and actions for use outside of React components if needed
useAuth.getState = useAuthStore.getState;
