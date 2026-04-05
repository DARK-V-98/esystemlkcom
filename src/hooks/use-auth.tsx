
"use client";

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignout,
  updateProfile,
  type AuthError
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuthContext as useAuthContextFromProvider } from '@/firebase/client-provider';
import { useToast } from './use-toast';

// This hook provides methods for authentication, consuming the main context.
export const useAuth = () => {
  const { auth, firestore } = useAuthContextFromProvider();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthError = (error: AuthError) => {
    console.error("Authentication error:", error.code, error.message);
    let description = "An unexpected error occurred. Please try again.";
    switch (error.code) {
        case 'auth/invalid-email':
            description = "The email address is not valid. Please check and try again.";
            break;
        case 'auth/user-disabled':
            description = "This user account has been disabled.";
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            description = "Invalid email or password. Please try again.";
            break;
        case 'auth/email-already-in-use':
            description = "An account with this email address already exists.";
            break;
        case 'auth/weak-password':
            description = "The password is too weak. Please use at least 6 characters.";
            break;
        case 'auth/popup-closed-by-user':
            description = "The sign-in window was closed. Please try again.";
            break;
        case 'auth/cancelled-popup-request':
            description = "Multiple sign-in windows were opened. Please try again.";
            break;
    }
    toast({
        title: "Authentication Failed",
        description: description,
        variant: "destructive",
    });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/admin');
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName });

      const userRef = doc(firestore, 'users', firebaseUser.uid);
      await setDoc(userRef, {
        email: firebaseUser.email,
        role: 'user',
        displayName: displayName,
        photoURL: firebaseUser.photoURL,
      }, { merge: true });

      router.push('/admin');
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignout(auth);
      router.push('/');
    } catch(error) {
       console.error("Error signing out:", error);
        toast({
            title: "Sign Out Failed",
            description: "Could not sign out. Please try again.",
            variant: "destructive",
        });
    }
  };

  return {
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
  };
};

// Re-export for easier consumption if desired, or just use the hook directly
export const useAuthContext = useAuthContextFromProvider;

