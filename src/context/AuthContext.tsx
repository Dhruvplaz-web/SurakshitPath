/**
 * SurakshitPath Commuter Auth Context
 * 
 * Provides unified authentication state, real-time user session,
 * and trusted guardian configuration across the entire app.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  CommuterUser,
  TrustedGuardian,
  signInWithGoogle,
  verifyPhoneWithMockOtp,
  signInAsGuest,
  signOutCommuter,
  onCommuterAuthChange,
  saveStoredGuardians,
  signInAsRole
} from '../services/firebaseAuthService';
import { UserRole } from '../types/routing';

export interface AuthContextType {
  user: CommuterUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isGuardianModalOpen: boolean;
  openGuardianModal: () => void;
  closeGuardianModal: () => void;
  signInGoogle: () => Promise<void>;
  signInPhone: (phone: string, otp: string) => Promise<void>;
  signInGuest: () => Promise<void>;
  signInRole: (role: UserRole, customEmail?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateGuardians: (guardians: TrustedGuardian[]) => void;
  addGuardian: (guardian: Omit<TrustedGuardian, 'id'>) => void;
  removeGuardian: (id: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { useAuth } from './useAuth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CommuterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onCommuterAuthChange((commuterUser) => {
      setUser(commuterUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openGuardianModal = () => setIsGuardianModalOpen(true);
  const closeGuardianModal = () => setIsGuardianModalOpen(false);

  const signInGoogle = async () => {
    setIsLoading(true);
    try {
      const loggedUser = await signInWithGoogle();
      setUser(loggedUser);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signInPhone = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await verifyPhoneWithMockOtp(phone, otp);
      setUser(loggedUser);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signInGuest = async () => {
    setIsLoading(true);
    try {
      const guest = await signInAsGuest();
      setUser(guest);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signInRole = async (role: UserRole, customEmail?: string) => {
    setIsLoading(true);
    try {
      const roleUser = await signInAsRole(role, customEmail);
      setUser(roleUser);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await signOutCommuter();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGuardians = (guardians: TrustedGuardian[]) => {
    saveStoredGuardians(guardians);
    setUser(prev => prev ? { ...prev, trustedGuardians: guardians } : null);
  };

  const addGuardian = (guardian: Omit<TrustedGuardian, 'id'>) => {
    const newGuardian: TrustedGuardian = {
      ...guardian,
      id: `g_${Date.now()}`
    };
    const updated = [...(user?.trustedGuardians || []), newGuardian];
    updateGuardians(updated);
  };

  const removeGuardian = (id: string) => {
    const updated = (user?.trustedGuardians || []).filter(g => g.id !== id);
    updateGuardians(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isGuardianModalOpen,
        openGuardianModal,
        closeGuardianModal,
        signInGoogle,
        signInPhone,
        signInGuest,
        signInRole,
        signOut,
        updateGuardians,
        addGuardian,
        removeGuardian
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
