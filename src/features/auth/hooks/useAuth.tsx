import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { type AuthUser } from "../types";

import {
  getProfile,
  login as loginRequest,
  logout as logoutRequest,
} from "@/lib/api/auth";

import { clearAuthToken, getAuthToken, getTokenExpiry } from "@/lib/api/token";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  isNewUser: boolean;
  tokenExpiry: number | null;
  login: (identifier: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [isNewUser, setIsNewUser] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;

    return window.localStorage.getItem("i-sew.is-new-user") === "true";
  });

  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthToken();

        if (!token) {
          setInitialized(true);
          return;
        }

        const storedUser = localStorage.getItem("user_data");

        // Immediately hydrate user from localStorage
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            return;
          } catch (error) {
            console.warn("Failed to parse stored user:", error);
            localStorage.removeItem("user_data");
          }
        }

        setLoading(true);
        setTokenExpiry(getTokenExpiry());

        // Fetch latest profile
        const profile = await getProfile();

        setUser(profile);

        localStorage.setItem("user_data", JSON.stringify(profile));
      } catch (error: any) {
        console.error("Auth initialization failed:", error);

        // Only clear auth if unauthorized
        if (error?.response?.status === 401) {
          clearAuthToken();

          localStorage.removeItem("user_data");

          setUser(null);
          setTokenExpiry(null);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    setLoading(true);

    try {
      const response = await loginRequest({
        identifier,
        password,
      });

      const authUser = response.user ?? null;

      setUser(authUser);

      // Persist user immediately
      if (authUser) {
        localStorage.setItem("user_data", JSON.stringify(authUser));
      }

      if (response && typeof response.is_new_user !== "undefined") {
        const newUser = Boolean(response.is_new_user);

        setIsNewUser(newUser);

        try {
          window.localStorage.setItem("i-sew.is-new-user", String(newUser));
        } catch (e) {
          console.warn(e);
        }
      }

      setTokenExpiry(getTokenExpiry());

      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await logoutRequest();
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      clearAuthToken();

      localStorage.removeItem("user_data");

      setUser(null);
      setTokenExpiry(null);

      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      initialized,
      isNewUser,
      tokenExpiry,
      login,
      logout,
    }),
    [user, loading, initialized, isNewUser, tokenExpiry, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
