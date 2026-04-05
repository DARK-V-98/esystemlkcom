
import { MetadataRoute } from 'next';
import { getFirestoreAdmin } from '@/firebase/admin';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://esystemlk.com';
 
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
    '/tools/api-tester',
    '/tools/barcode-generator',
    '/tools/base64-encoder',
    '/tools/case-converter',
    '/tools/code-minifier',
    '/tools/color-palette-generator',
    '/tools/csrf-token-generator',
    '/tools/csv-excel-converter',
    '/tools/currency-converter',
    '/tools/favicon-generator',
    '/tools/file-encryption',
    '/tools/gst-vat-calculator',
    '/tools/hash-generator',
    '/tools/hmac-generator',
    '/tools/html-entity-encoder',
    '/tools/image-compressor',
    '/tools/image-converter',
    '/tools/image-cropper',
    '/tools/image-metadata-viewer',
    '/tools/image-resizer',
    '/tools/invoice-generator',
    '/tools/json-csv-converter',
    '/tools/jwt-decoder',
    '/tools/lorem-ipsum-generator',
    '/tools/markdown-to-html',
    '/tools/meta-tag-generator',
    '/tools/my-ip',
    '/tools/number-base-converter',
    '/tools/password-generator',
    '/tools/pdf-watermarker',
    '/tools/qr-code-generator',
    '/tools/qr-code-scanner',
    '/tools/regex-tester',
    '/tools/robots-txt-generator',
    '/tools/sitemap-xml-generator',
    '/tools/slug-generator',
    '/tools/ssl-checker',
    '/tools/svg-optimizer',
    '/tools/text-binary-converter',
    '/tools/text-to-speech',
    '/tools/time-zone-converter',
    '/tools/timestamp-converter',
    '/tools/uptime-checker',
    '/tools/url-encoder',
    '/tools/word-counter',
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
