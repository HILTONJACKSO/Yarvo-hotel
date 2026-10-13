import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/super-admin/', '/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://yarvohotel.com/sitemap.xml',
  };
}
