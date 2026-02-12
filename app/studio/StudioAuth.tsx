"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface StudioAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const StudioAuthContext = createContext<StudioAuthContextType | null>(null);

export function StudioAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verify existing token on mount
  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem("studio_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/studio/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("studio_token");
          }
        } else {
          localStorage.removeItem("studio_token");
        }
      } catch {
        // If verification fails, clear the token
        localStorage.removeItem("studio_token");
      }

      setIsLoading(false);
    }

    verifySession();
  }, []);

  const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/studio/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("studio_token", data.token);
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: data.message || "Invalid password" };
    } catch {
      return { success: false, error: "Connection error. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("studio_token");

    try {
      await fetch(`${API_BASE_URL}/auth/studio/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } catch {
      // Ignore logout errors
    }

    localStorage.removeItem("studio_token");
    setIsAuthenticated(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <StudioAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </StudioAuthContext.Provider>
  );
}

export function useStudioAuth() {
  const context = useContext(StudioAuthContext);
  if (!context) {
    throw new Error("useStudioAuth must be used within StudioAuthProvider");
  }
  return context;
}

export function StudioLoginGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, login } = useStudioAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await login(password);

    if (!result.success) {
      setError(result.error || "Invalid password");
      setPassword("");
    }

    setIsSubmitting(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-2xl mx-auto mb-4">
            A
          </div>
          <h1 className="text-2xl font-serif mb-2">Studio Access</h1>
          <p className="text-sm text-[var(--muted)]">
            Enter password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none text-center tracking-widest disabled:opacity-50"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--error)] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] rounded-lg hover:bg-[var(--accent)] transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </>
            ) : (
              "Enter Studio"
            )}
          </button>
        </form>

        <p className="text-xs text-[var(--muted-soft)] text-center mt-8">
          This area is private. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
