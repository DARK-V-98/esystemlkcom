
import { MetadataRoute } from 'next';
import { getFirestoreAdmin } from '@/firebase/admin';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.esystemlk.xyz';
 
  // Static pages
  const staticPages = [
    '/',
    '/about',
    '/contact',
    '/portfolio',
    '/pricing',
    '/privacy-policy',
    '/services',
    '/testimonials',
    '/founder-message',
    '/tools',
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: page === '/' ? 1 : 0.8,
  }));

  // Dynamic blog posts
  const firestore = getFirestoreAdmin();
  const blogCollection = collection(firestore, 'blog');
  const blogSnapshot = await getDocs(blogCollection);
  const blogUrls = blogSnapshot.docs.map(doc => ({
    url: `${baseUrl}/blog/${doc.data().slug}`,
    lastModified: doc.data().updatedAt?.toDate() || doc.data().createdAt.toDate(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...blogUrls];
}
