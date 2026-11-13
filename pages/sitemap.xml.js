const SITE_URL = 'https://www.gianlucarainis.com';

const pages = [
    {
        loc: '',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 1.0,
    },
    {
        loc: '/curriculum',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
    },
    {
        loc: '/contact',
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.8,
    },
    {
        loc: '/search',
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.8,
    },
];

export async function getServerSideProps({ res }) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages.map((page) => `
            <url>
                <loc>${SITE_URL}${page.loc}</loc>
                <lastmod>${page.lastmod}</lastmod>
                <changefreq>${page.changefreq}</changefreq>
                <priority>${page.priority}</priority>
            </url>
        `).join('')}
    </urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default function Sitemap() {
    return null;
}
