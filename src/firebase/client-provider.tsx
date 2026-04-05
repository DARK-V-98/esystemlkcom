
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { initializeFirebase } from '@/firebase';
import { Auth, onAuthStateChanged, User as FirebaseAuthUser, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import LoadingScreen from '@/components/LoadingScreen';

// --- Type Definitions ---
type UserRole = 'user' | 'admin' | 'developer';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  user: User | null;
  loading: boolean;
}

// --- Context Creation ---
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// --- Utility Function ---
const formatUser = (user: FirebaseAuthUser, role: UserRole = 'user'): User => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  role: role,
});

// --- Main Provider Component ---
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Memoize Firebase services initialization
  const { firebaseApp, auth, firestore } = useMemo(() => {
    const services = initializeFirebase();
    // Set persistence to local storage to keep user signed in across sessions
    setPersistence(services.auth, browserLocalPersistence);
    return {
      firebaseApp: services.firebaseApp,
      auth: services.auth,
      firestore: services.firestore,
    };
  }, []);

  // Effect for handling window load to hide loading screen
  useEffect(() => {
    const handleLoad = () => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
            setIsAppLoading(false);
        }, 500);
      } else {
        setIsAppLoading(false);
      }
    };
    
    if (document.readyState === 'complete') {
        handleLoad();
    } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Effect for handling auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userRef = doc(firestore, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser(formatUser(firebaseUser, userData.role || 'user'));
          } else {
            // Create user document if it doesn't exist (e.g., first Google sign-in)
            const newUserDoc = { 
              email: firebaseUser.email, 
              role: 'user', 
              displayName: firebaseUser.displayName || 'New User',
              photoURL: firebaseUser.photoURL,
            };
            await setDoc(userRef, newUserDoc);
            setUser(formatUser(firebaseUser, 'user'));
          }
        } catch (error) {
            console.error("Error fetching or creating user document:", error);
            // Even if Firestore fails, we can set a basic user object
            setUser(formatUser(firebaseUser, 'user'));
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const contextValue = useMemo(() => ({
    firebaseApp,
    auth,
    firestore,
    user,
    loading
  }), [firebaseApp, auth, firestore, user, loading]);

  return (
    <>
      {isAppLoading && <LoadingScreen />}
      <FirebaseContext.Provider value={contextValue}>
        {children}
      </FirebaseContext.Provider>
    </>
  );
}

// --- Custom Hook ---
export const useAuthContext = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a FirebaseClientProvider');
  }
  return context;
};
