import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import styles from '@/styles/search.module.css';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Search"
        }
    }
}

export default function SearchPage({ pageTitle = "Search" }) {
    const router = useRouter();
    const { q } = router.query;
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(q || '');

    useEffect(() => {
        if (typeof q === 'string') {
            setSearchQuery(q);
            performSearch(q);
        }
    }, [q]);

    async function performSearch(query) {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (response.ok) {
                setResults(data.results || []);
            }
            else {
                setError(data.error || 'Search failed');
                setResults([]);
            }
        } catch (err) {
            setError('Failed to fetch search results');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function handleNewSearch() {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleNewSearch();
        }
    }

    return (
        <>
            <Head pageTitle={`${pageTitle}`} pageUrl="/search" />
            <Nav />

            <main className={styles.searchContainer}>
                <div className={styles.searchHeader}>
                    <h1>Search Results</h1>
                    <div className={styles.searchBox}>
                        <input
                            type='text'
                            className={styles.searchInput}
                            placeholder='Search the site...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            aria-label='Search query'
                        />
                        <button
                            type='button'
                            className={styles.searchButton}
                            onClick={handleNewSearch}
                            disabled={!searchQuery.trim()}
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className={styles.resultsSection}>
                    {loading && (
                        <p className={styles.message}>Loading results...</p>
                    )}

                    {error && !loading && (
                        <p className={styles.error}>Error: {error}</p>
                    )}

                    {!loading && !error && results.length === 0 && q && (
                        <p className={styles.message}>
                            No results found for "<strong>{q}</strong>"
                        </p>
                    )}

                    {!loading && !error && results.length === 0 && !q && (
                        <p className={styles.message}>
                            Enter a search query to get started
                        </p>
                    )}

                    {results.length > 0 && (
                        <>
                            <p className={styles.resultCount}>
                                Found {results.length} result{results.length !== 1 ? 's' : ''}
                            </p>
                            <ul className={styles.resultsList}>
                                {results.map((result) => (
                                    <li key={result.id} className={styles.resultItem}>
                                        <div className={styles.resultContent}>
                                            <span className={styles.category}>{result.category}</span>
                                            <h2 className={styles.resultTitle}>
                                                {result.url.startsWith('http') ? (
                                                    <a href={result.url} target='_blank' rel='noopener noreferrer'>
                                                        {result.title}
                                                    </a>
                                                ) : result.url.startsWith('mailto:') ? (
                                                    <a href={result.url}>
                                                        {result.title}
                                                    </a>
                                                ) : (
                                                    <Link href={result.url}>
                                                        {result.title}
                                                    </Link>
                                                )}
                                            </h2>
                                            <p className={styles.resultDescription}>
                                                {result.excerpt || result.content}
                                            </p>
                                            <a href={result.url} className={styles.resultUrl}>
                                                {result.url.startsWith('http') || result.url.startsWith('mailto:') 
                                                    ? result.url 
                                                    : `https://gianlucarainis.com${result.url}`
                                                }
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}