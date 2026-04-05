
'use server';

import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getFirestoreAdmin } from '@/firebase/admin';

export type UserRole = 'user' | 'admin' | 'developer';

export interface ManagedUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
}

export async function getUsers(): Promise<ManagedUser[]> {
  const db = getFirestoreAdmin();
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, orderBy('displayName'));
    const userSnapshot = await getDocs(q);
    const userList = userSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    })) as ManagedUser[];
    return userList;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}

export async function updateUserRole(uid: string, role: UserRole) {
  const db = getFirestoreAdmin();
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role });
    return { success: true, message: 'User role updated successfully.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: `Failed to update user role: ${message}` };
  }
}

export async function deleteUser(uid: string) {
  const db = getFirestoreAdmin();
  try {
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
    return { success: true, message: 'User deleted successfully.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: `Failed to delete user: ${message}` };
  }
}
