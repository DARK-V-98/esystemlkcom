// IMPORTANT: This file should NOT have 'use client'
// It is intended for server-side use only.

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let storage: FirebaseStorage;

// Initialize Firebase for server-side environments
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

firestore = getFirestore(firebaseApp);
storage = getStorage(firebaseApp);

export function getFirestoreAdmin(): Firestore {
  return firestore;
}

export function getStorageAdmin(): FirebaseStorage {
  return storage;
}
