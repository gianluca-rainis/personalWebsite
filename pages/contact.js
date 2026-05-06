import React from 'react';
import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Head from '@/components/Head';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Contact Me"
        }
    }
}

export default function SearchPage({ pageTitle = "Contact Me" }) {
    const path = usePathname();

    return (
        <>
            <Head pageTitle={`${pageTitle}`} pageUrl={path} />
            <Nav />

            <main>
                
            </main>
        </>
    );
}