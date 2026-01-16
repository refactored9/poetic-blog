"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface StudioAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const StudioAuthContext = createContext<StudioAuthContextType | null>(null);

// This should match STUDIO_PASSWORD in your .env.local
const STUDIO_PASSWORD = process.env.NEXT_PUBLIC_STUDIO_PASSWORD || "akash2024";

export function StudioAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated from session storage
    const auth = sessionStorage.getItem("studio_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === STUDIO_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("studio_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("studio_auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <StudioAuthContext.Provider value={{ isAuthenticated, login, logout }}>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError("Incorrect password");
      setPassword("");
    }
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
              className="w-full px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none text-center tracking-widest"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--error)] text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] rounded-lg hover:bg-[var(--accent)] transition-colors font-medium"
          >
            Enter Studio
          </button>
        </form>

        <p className="text-xs text-[var(--muted-soft)] text-center mt-8">
          This area is private. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
