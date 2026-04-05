
'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getFirestoreAdmin } from '@/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/admin-app';
import { headers } from 'next/headers';


const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters.'),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters.').optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});


async function getAuthenticatedUser() {
    const headerList = headers();
    const sessionCookie = headerList.get('session') || '';
    if (!sessionCookie) return null;
    try {
        const decodedClaims = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
        return decodedClaims;
    } catch(e) {
        return null;
    }
}

export async function updateProfile(formData: z.infer<typeof profileSchema>) {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
        return { success: false, message: 'Authentication required.' };
    }

    try {
        const validatedData = profileSchema.parse(formData);
        const firestore = getFirestoreAdmin();
        const userRef = doc(firestore, 'users', authUser.uid);
        
        await updateDoc(userRef, validatedData);

        // Also update the display name in Firebase Auth
        await getAuth(adminApp).updateUser(authUser.uid, {
            displayName: validatedData.displayName,
        });

        revalidatePath(`/admin/profile`);
        revalidatePath(`/profile/${authUser.uid}`);

        return { success: true, message: 'Profile updated successfully.' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message };
    }
}
