import fs from 'fs/promises';
import path from 'path';

const CACHE_TTL_MS = 5 * 60 * 1000; // Cathe TTL of 5 minutes

let cachedIndex = null; // Cached search index
let cachedAt = 0; // Timestamp of when the index was cached
let inFlightBuild = null; // Promise of index build to prevent concurrent builds

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { q } = req.query; // The searched query

    if (!q || typeof q !== 'string') {
        return res.status(400).json({
            error: 'Query parameter required',
            results: []
        });
    }

    const searchQuery = q.toLowerCase().trim();

    if (searchQuery.length < 2) {
        return res.status(400).json({
            error: 'Query too short',
            results: []
        });
    }

    const searchIndex = await getSearchIndex(req); // Get the search index

    const results = searchIndex.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchQuery);
        const contentMatch = item.content.toLowerCase().includes(searchQuery);
        const categoryMatch = item.category.toLowerCase().includes(searchQuery);

        return titleMatch || contentMatch || categoryMatch;
    }).map(item => ({
        ...item,
        relevance: calculateRelevance(item, searchQuery)
    })).sort((a, b) => b.relevance - a.relevance);

    res.status(200).json({
        query: q,
        results,
        count: results.length
    });
}

async function getSearchIndex(req) {
    const cacheIsFresh = cachedIndex && (Date.now() - cachedAt) < CACHE_TTL_MS; // Check if cached index is still valid

    if (cacheIsFresh) {
        return cachedIndex;
    }

    if (!inFlightBuild) {
        inFlightBuild = buildSearchIndex(req) // Start building the index and cache it when done
            .then(index => {
                cachedIndex = index;
                cachedAt = Date.now();

                return index;
            })
            .finally(() => {
                inFlightBuild = null;
            });
    }

    return inFlightBuild;
}

async function buildSearchIndex(req) {
    const baseUrl = getBaseUrl(req); // Get the base URL to fetch pages
    const routes = await getSiteRoutes(); // Get all site routes

    const pages = await Promise.all(routes.map(async (route) => { // Get content of each page
        const page = await fetchPageSnapshot(baseUrl, route); // Fetch the page content

        if (!page) {
            return null;
        }

        const content = [page.description, page.text].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(); // Get the content

        if (!content) {
            return null;
        }

        return {
            id: route,
            title: cleanTitle(page.title || route),
            content,
            excerpt: cutLongText(content),
            url: route,
            category: route === '/' ? 'Home' : 'Page'
        };
    }));

    return pages.filter(Boolean); // Filter out any null results
}

async function getSiteRoutes() {
    const pagesDir = path.join(process.cwd(), 'pages'); // Path to the pages directory
    const collectedRoutes = []; // Array to collect routes

    async function walk(currentDir, routePrefix = '') {
        const entries = await fs.readdir(currentDir, { withFileTypes: true }); // Read the directory entries

        for (const entry of entries) {
            if (entry.name.startsWith('_')) { // Ignore Next.js files
                continue;
            }

            if (entry.isDirectory()) {
                if (entry.name === 'api') { // Ignore API routes
                    continue;
                }

                const nestedPrefix = `${routePrefix}/${entry.name}`; // Get the next route

                await walk(path.join(currentDir, entry.name), nestedPrefix); // Recurse into the directory

                continue;
            }

            const ext = path.extname(entry.name); // Get the file extension
            const baseName = path.basename(entry.name, ext); // Get the file name (no extension)

            if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) { // Only consider JavaScript/TypeScript pages
                continue;
            }

            if (baseName === 'search' || baseName === '404' || baseName === '500') { // Ignore some special pages
                continue;
            }

            const routePath = baseName === 'index' ? routePrefix || '/' : `${routePrefix}/${baseName}`; // Determine the route path

            if (!collectedRoutes.includes(routePath)) { // Avoid duplicates
                collectedRoutes.push(routePath); // Add the route to the collected routes
            }
        }
    }

    await walk(pagesDir);

    return collectedRoutes;
}

async function fetchPageSnapshot(baseUrl, route) {
    try {
        const response = await fetch(new URL(route, baseUrl).toString()); // Fetch the page content

        if (!response.ok) {
            return null;
        }

        const html = await response.text(); // Get the HTML content of the page

        return {
            title: extractTitle(html),
            description: extractMetaDescription(html),
            text: extractVisibleText(html)
        };
    } catch {
        return null;
    }
}

function getBaseUrl(req) {
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || 'http'; // Get the protocol
    const host = req.headers.host || 'localhost:3000'; // Get the host

    return `${protocol}://${host}`; // Construct the base URL
}

function extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i); // Extract the title from the HTML

    return decodeHtmlEntities(titleMatch ? titleMatch[1].trim() : ''); // Decode HTML entities and return the title
}

function extractMetaDescription(html) {
    const descriptionMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i);

    return decodeHtmlEntities(descriptionMatch ? descriptionMatch[1].trim() : ''); // Decode HTML entities and return the description
}

function extractVisibleText(html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i); // Get the body
    const bodyHtml = bodyMatch ? bodyMatch[1] : html; // If no body, use the entire HTML

    return decodeHtmlEntities(
        bodyHtml
            .replace(/<!--([\s\S]*?)-->/g, ' ') // Remove comments
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ') // Remove scripts
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ') // Remove styles
            .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ') // Remove noscript
            .replace(/<[^>]+>/g, ' ') // Remove all HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim()
    );
}

function decodeHtmlEntities(text) {
    return text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function cleanTitle(title) {
    return title.replace(/^Gianluca Rainis\s*-\s*/i, '').trim() || 'Page'; // Remove site standard prefix
}

function cutLongText(text, maxLength = 180) {
    if (text.length <= maxLength) { // If the text is short, return it
        return text;
    }

    return `${text.slice(0, maxLength - 1).trimEnd()}...`; // If the text is long, cut it
}

function calculateRelevance(item, query) {
    let score = 0; // Basic relevance scoring based on matches in title, content, and category

    if (item.title.toLowerCase() === query) { // Exact title match
        score += 100;
    }
    else if (item.title.toLowerCase().includes(query)) { // Partial title match
        score += 50;
    }

    if (item.content.toLowerCase().includes(query)) { // Content match
        score += 20;
    }

    if (item.category.toLowerCase().includes(query)) { // Category match
        score += 10;
    }

    return score;
}