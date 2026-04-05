'use server';

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirestoreAdmin } from '@/firebase/admin';

export type PageVisibility = {
    showServices: boolean;
    showTestimonials: boolean;
    showPricing: boolean;
};

const defaultSettings: PageVisibility = {
    showServices: true,
    showTestimonials: true,
    showPricing: true,
};

const getSettingsDocRef = () => {
    const db = getFirestoreAdmin();
    return doc(db, 'siteConfig', 'pageSettings');
}

export async function getPageSettings(): Promise<PageVisibility> {
    try {
        const docSnap = await getDoc(getSettingsDocRef());
        if (docSnap.exists()) {
            return { ...defaultSettings, ...docSnap.data() } as PageVisibility;
        }
        return defaultSettings;
    } catch (error) {
        console.error("Error fetching page settings: ", error);
        return defaultSettings;
    }
}

export async function initializePageSettings() {
    try {
        await setDoc(getSettingsDocRef(), defaultSettings);
        return { success: true, message: 'Successfully initialized page settings.' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message };
    }
}

export async function updatePageVisibility(pageKey: keyof PageVisibility, isVisible: boolean) {
    try {
        await updateDoc(getSettingsDocRef(), { [pageKey]: isVisible });
        return { success: true, message: 'Page visibility updated successfully.' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        // Try to set the document if it doesn't exist.
        if (message.includes('No document to update')) {
             try {
                await setDoc(getSettingsDocRef(), { ...defaultSettings, [pageKey]: isVisible });
                return { success: true, message: 'Page visibility updated successfully.' };
            } catch (e) {
                 const setMessage = e instanceof Error ? e.message : 'An unknown error occurred';
                 return { success: false, message: `Failed to update page visibility: ${setMessage}` };
            }
        }
        return { success: false, message: `Failed to update page visibility: ${message}` };
    }
}
