import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Application',
    description: 'A modern web application built with Next.js and PrimeReact',
    robots: { index: true, follow: true },
    viewport: { 
        initialScale: 1,
        width: 'device-width',
        minimumScale: 1,
        maximumScale: 5,
        userScalable: true
    },
    openGraph: {
        type: 'website',
        title: 'My Application',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        description: 'A modern web application built with Next.js and PrimeReact',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'My Application'
            }
        ],
        siteName: 'My Application'
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
        shortcut: '/favicon-16x16.png'
    },
    themeColor: '#ffffff',
    manifest: '/manifest.json'
}; 