import React from 'react';
import HeadNext from 'next/head';
import { useRouter } from 'next/router';

const siteUrl = 'https://www.gianlucarainis.com';
const siteName = 'Gianluca Rainis';
const description = 'Gianluca Rainis is a student of Computer Science who is passionate about software development, hardware design and innovation.';
const previewImage = `${siteUrl}/gianlucarainisPreview.png`;
const picture = `${siteUrl}/gianlucarainis.png`;

export default function Head({ pageTitle = '', pageUrl }) {
    const router = useRouter();
    const path = router.asPath.split('?')[0].split('#')[0];
    const canonicalUrl = pageUrl || `${siteUrl}${path === '/' ? '' : path}`;
    const fullTitle = pageTitle ? `${siteName} - ${pageTitle}` : siteName;

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName,
            alternateName: ['Rainis', 'G. Rainis'],
            url: siteUrl
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: siteName,
            givenName: 'Gianluca',
            familyName: 'Rainis',
            knownLanguage: ['Italian', 'English'],
            description: description,
            url: siteUrl,
            image: picture,
            jobTitle: 'Computer Science Student and Developer',
            affiliation: [
                { '@type': 'CollegeOrUniversity', name: 'Università degli Studi di Udine' },
                { '@type': 'Organization', name: 'Mensa Italia' }
            ],
            sameAs: [
                'https://projects.gianlucarainis.com',
                'https://github.com/gianluca-rainis',
                'https://www.linkedin.com/in/gianluca-rainis/'
            ]
        }
    ];

    return (
        <HeadNext>
            <title>{fullTitle}</title>
            <link rel="canonical" href={canonicalUrl} />
            <meta name="description" content={description} />
            <meta name="author" content={siteName} />
            <meta name="robots" content="index, follow, max-image-preview:large" />

            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={previewImage} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Gianluca Rainis preview image" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={previewImage} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </HeadNext>
    );
}
