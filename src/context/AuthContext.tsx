"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface StudioMember {
  id: string;
  name: string;
  keyOrEmail: string;
  role: "Owner" | "Editor" | "Viewer";
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: { name: string; role: string; key: string } | null;
  masterKey: string;
  members: StudioMember[];
  login: (key: string) => boolean;
  logout: () => void;
  addMember: (name: string, keyOrEmail: string, role?: "Editor" | "Viewer") => void;
  removeMember: (id: string) => void;
  updateMasterKey: (newKey: string) => void;
}

const DEFAULT_MASTER_KEY = "rewriteminds2026";
const AUTH_STORAGE_KEY = "rm_studio_auth_session";
const MEMBERS_STORAGE_KEY = "rm_studio_authorized_members";
const MASTER_KEY_STORAGE = "rm_studio_master_key";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; key: string } | null>(null);
  const [masterKey, setMasterKey] = useState<string>(DEFAULT_MASTER_KEY);
  const [members, setMembers] = useState<StudioMember[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedMaster = localStorage.getItem(MASTER_KEY_STORAGE);
      if (storedMaster) {
        setMasterKey(storedMaster);
      }

      const storedMembers = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
      } else {
        // Initial default members
        const initialMembers: StudioMember[] = [
          {
            id: "owner-1",
            name: "Muzammil",
            keyOrEmail: storedMaster || DEFAULT_MASTER_KEY,
            role: "Owner",
            createdAt: new Date().toISOString(),
          },
        ];
        setMembers(initialMembers);
        localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(initialMembers));
      }

      const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setCurrentUser(session);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn("Failed to read auth state", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = (inputKey: string): boolean => {
    const trimmed = inputKey.trim();
    if (!trimmed) return false;

    const currentMaster = localStorage.getItem(MASTER_KEY_STORAGE) || masterKey;

    // Check Master Key (Owner)
    if (trimmed.toLowerCase() === currentMaster.toLowerCase()) {
      const user = { name: "Muzammil", role: "Owner", key: trimmed };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return true;
    }

    // Check Collaborator / Member list
    const currentMembers: StudioMember[] = (() => {
      try {
        const m = localStorage.getItem(MEMBERS_STORAGE_KEY);
        return m ? JSON.parse(m) : members;
      } catch {
        return members;
      }
    })();

    const matched = currentMembers.find(
      (m) => m.keyOrEmail.toLowerCase() === trimmed.toLowerCase()
    );

    if (matched) {
      const user = { name: matched.name, role: matched.role, key: trimmed };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {}
  };

  const addMember = (name: string, keyOrEmail: string, role: "Editor" | "Viewer" = "Editor") => {
    const newMember: StudioMember = {
      id: "member_" + Date.now(),
      name: name.trim(),
      keyOrEmail: keyOrEmail.trim(),
      role,
      createdAt: new Date().toISOString(),
    };
    const updated = [...members, newMember];
    setMembers(updated);
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const removeMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const updateMasterKey = (newKey: string) => {
    const trimmed = newKey.trim();
    if (!trimmed) return;
    setMasterKey(trimmed);
    try {
      localStorage.setItem(MASTER_KEY_STORAGE, trimmed);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        masterKey,
        members,
        login,
        logout,
        addMember,
        removeMember,
        updateMasterKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
