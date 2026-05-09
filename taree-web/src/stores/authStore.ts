import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual API call
          const mockUser: User = {
            id: "1",
            email,
            firstName: "Amara",
            lastName: "Okafor",
            role: "customer",
            emailVerified: true,
          };
          set({ user: mockUser, isAuthenticated: true });
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual API call
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        // TODO: Implement token validation
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "taree-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
