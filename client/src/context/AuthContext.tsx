import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { api } from '../services/api';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  loginAsDemoLearner: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('skill_setu_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const saveUserLocally = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('skill_setu_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('skill_setu_user');
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const tokenResult = await fbUser.getIdTokenResult();
            const role = (tokenResult.claims.role as UserRole) || 'learner';
            const { user: synced } = await api.syncProfile(
              fbUser.uid,
              fbUser.email || undefined,
              fbUser.displayName || undefined
            );
            saveUserLocally({ ...synced, role: role || synced.role });
          } catch (err) {
            console.warn('Sync profile error:', err);
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (auth) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const { user: synced } = await api.syncProfile(cred.user.uid, cred.user.email || email);
        saveUserLocally(synced);
      } else {
        // Mock fallback login
        const { user: synced } = await api.syncProfile(`u-${Date.now()}`, email, email.split('@')[0]);
        saveUserLocally(synced);
      }
    } catch (err: any) {
      console.warn('Firebase login notice, using local profile fallback:', err);
      const { user: synced } = await api.syncProfile(`u-${Date.now()}`, email, email.split('@')[0]);
      saveUserLocally(synced);
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string, role: UserRole) => {
    setLoading(true);
    try {
      let uid = `user-${Date.now()}`;
      if (auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, pass);
          uid = cred.user.uid;
        } catch (e) {
          console.warn('Firebase signup notice:', e);
        }
      }
      const { user: synced } = await api.setRole(uid, role, email, name);
      saveUserLocally(synced);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (role: UserRole = 'learner') => {
    setLoading(true);
    try {
      if (auth && googleProvider) {
        const res = await signInWithPopup(auth, googleProvider);
        const { user: synced } = await api.setRole(
          res.user.uid,
          role,
          res.user.email || undefined,
          res.user.displayName || undefined
        );
        saveUserLocally(synced);
      } else {
        await loginAsDemoLearner();
      }
    } catch (err: any) {
      console.warn('Google sign-in popup fallback:', err);
      await loginAsDemoLearner();
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoLearner = async () => {
    setLoading(true);
    try {
      const { user: synced } = await api.setRole(
        'demo-learner-123',
        'learner',
        'learner@skillsetu.io',
        'Aarav Sharma'
      );
      saveUserLocally(synced);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoAdmin = async () => {
    setLoading(true);
    try {
      const { user: synced } = await api.setRole(
        'demo-admin-999',
        'admin',
        'admin@skillsetu.io',
        'Prof. Vikram Seth'
      );
      saveUserLocally(synced);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    const { user: updated } = await api.setRole(user.uid, newRole, user.email, user.displayName);
    saveUserLocally(updated);
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    saveUserLocally(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const { user: synced } = await api.syncProfile(user.uid, user.email, user.displayName);
      saveUserLocally(synced);
    } catch (err) {
      console.error('Refresh profile error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginAsDemoLearner,
        loginAsDemoAdmin,
        logout,
        refreshProfile,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
