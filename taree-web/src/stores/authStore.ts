import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { api } from "../lib/api";
import { useToastStore } from "./toastStore";
import { useCartStore } from "./cartStore";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
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
          await api.post("/auth/login", { email, password });
          // After login, fetch current user
          const { data: userData } = await api.get("/auth/me");
          const user: User = {
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            phone: userData.phone,
            role: userData.role,
            emailVerified: userData.email_verified,
          };
          set({ user, isAuthenticated: true });
          useToastStore.getState().addToast(`Welcome back, ${user.firstName}!`, "success");
        } catch (error: any) {
          console.error("Login failed:", error);
          useToastStore.getState().addToast(error.response?.data?.detail || "Login failed", "error");
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          await api.post("/auth/register", data);
        } catch (error: any) {
          console.error("Registration failed:", error);
          useToastStore.getState().addToast(error.response?.data?.detail || "Registration failed", "error");
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout API call failed:", error);
        }
        // Always clear local state even if API fails
        set({ user: null, isAuthenticated: false, isLoading: false });
        useCartStore.getState().clearCart();
      },

      checkAuth: async () => {
        try {
          const { data: userData } = await api.get("/auth/me");
          const user: User = {
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            phone: userData.phone,
            role: userData.role,
            emailVerified: userData.email_verified,
          };
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "taree-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
