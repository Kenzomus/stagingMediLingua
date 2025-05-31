
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  type User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Using next/navigation for App Router

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  signUpWithEmail: (email: string, password: string) => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthError = (err: unknown, defaultMessage: string): string => {
    let message = defaultMessage;
    if (err && typeof err === 'object' && 'code' in err) {
      const firebaseError = err as AuthError;
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          message = 'This email address is already in use.';
          break;
        case 'auth/invalid-email':
          message = 'The email address is not valid.';
          break;
        case 'auth/operation-not-allowed':
          message = 'This operation is not allowed. Please contact support.';
          break;
        case 'auth/weak-password':
          message = 'The password is too weak.';
          break;
        case 'auth/user-disabled':
          message = 'This user account has been disabled.';
          break;
        case 'auth/user-not-found':
          message = 'No user found with this email.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password.';
          break;
        case 'auth/popup-closed-by-user':
          message = 'Google Sign-In popup closed by user.';
          break;
        case 'auth/cancelled-popup-request':
          message = 'Multiple Google Sign-In popups opened. Please try again.';
          break;
        case 'auth/account-exists-with-different-credential':
            message = 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.';
            break;
        default:
          message = firebaseError.message || defaultMessage;
      }
    } else if (err instanceof Error) {
        message = err.message;
    }
    setError(message);
    toast({ title: 'Authentication Error', description: message, variant: 'destructive' });
    return message;
  };

  const signUpWithEmail = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      // In a real app, you might want to save additional user info to Firestore here
      // e.g., await addUserProfileToFirestore(userCredential.user, { firstName, lastName, accountType });
      toast({ title: 'Registration Successful', description: 'Welcome!' });
      return userCredential.user;
    } catch (err) {
      handleAuthError(err, 'Registration failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      return userCredential.user;
    } catch (err) {
      handleAuthError(err, 'Login failed. Please check your credentials.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      toast({ title: 'Google Sign-In Successful', description: 'Welcome!' });
      return result.user;
    } catch (err) {
      handleAuthError(err, 'Google Sign-In failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/'); // Redirect to home or login page
    } catch (err) {
      handleAuthError(err, 'Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    setError,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
