
'use server';

import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getFirestoreAdmin, getStorageAdmin } from '@/firebase/admin';
import { headers } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/admin-app';

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    headerImageUrl?: string;
    createdAt: any;
    updatedAt?: any;
    authorId: string;
    authorName: string;
}

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(20, "Content must be at least 20 characters."),
});

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

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

export async function addPost(formData: FormData) {
    const firestore = getFirestoreAdmin();
    const storage = getStorageAdmin();
    const authUser = await getAuthenticatedUser();
    
    if (!authUser) {
      return { success: false, message: 'Authentication required.' };
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const headerImage = formData.get('headerImage') as File | null;

    try {
        const validatedData = postSchema.parse({ title, content });
        let imageUrl: string | undefined = undefined;

        if (headerImage && headerImage.size > 0) {
            const storageRef = ref(storage, `blog/${Date.now()}_${headerImage.name}`);
            await uploadBytes(storageRef, headerImage);
            imageUrl = await getDownloadURL(storageRef);
        }

        const slug = generateSlug(validatedData.title);

        await addDoc(collection(firestore, 'blog'), {
            title: validatedData.title,
            slug: slug,
            content: validatedData.content,
            headerImageUrl: imageUrl,
            authorId: authUser.uid,
            authorName: authUser.name || authUser.email || 'Admin',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);

        const posts = await getPosts();
        return { success: true, message: 'Post added successfully.', posts };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message };
    }
}

export async function updatePost(formData: FormData) {
    const firestore = getFirestoreAdmin();
    const storage = getStorageAdmin();
    
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const headerImage = formData.get('headerImage') as File | null;

    if (!id) return { success: false, message: "Post ID is missing." };

    try {
        const validatedData = postSchema.parse({ title, content });
        const postRef = doc(firestore, 'blog', id);

        const updateData: any = {
            title: validatedData.title,
            content: validatedData.content,
            slug: generateSlug(validatedData.title),
            updatedAt: serverTimestamp(),
        };

        if (headerImage && headerImage.size > 0) {
            const storageRef = ref(storage, `blog/${Date.now()}_${headerImage.name}`);
            await uploadBytes(storageRef, headerImage);
            updateData.headerImageUrl = await getDownloadURL(storageRef);
        }

        await updateDoc(postRef, updateData);

        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        revalidatePath(`/blog/${updateData.slug}`);

        const posts = await getPosts();
        return { success: true, message: 'Post updated successfully.', posts };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message };
    }
}

export async function deletePost(id: string, imageUrl?: string) {
    const firestore = getFirestoreAdmin();
    const storage = getStorageAdmin();
    
    if (!id) return { success: false, message: "Post ID is missing." };

    try {
        await deleteDoc(doc(firestore, 'blog', id));
        if (imageUrl) {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef).catch(err => console.warn("Failed to delete image, it may not exist:", err));
        }

        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        
        const posts = await getPosts();
        return { success: true, message: 'Post deleted successfully.', posts };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Failed to delete post: ${message}` };
    }
}

async function getPosts() {
    const firestore = getFirestoreAdmin();
    const postsCollection = collection(firestore, 'blog');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate().toISOString(),
            updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
        } as Post;
    });
    return postList;
}
