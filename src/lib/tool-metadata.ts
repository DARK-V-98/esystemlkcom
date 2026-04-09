
import { Metadata } from 'next';

export function getToolMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} | ESYSTEMLK Developer Tools`,
    description: description,
    openGraph: {
      title: `${title} | Free Online Developer Tool`,
      description: description,
      url: 'https://esystemlk.com/tools',
      type: 'website',
      siteName: 'ESYSTEMLK',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ESYSTEMLK Developer Tools`,
      description: description,
    },
  };
}
