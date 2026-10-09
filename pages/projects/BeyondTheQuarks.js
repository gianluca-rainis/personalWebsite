import React from 'react';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import { usePathname } from 'next/navigation';
import Terminal from '@/components/Terminal';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Beyond the Quarks"
        }
    }
}

export default function ProjectPage({ pageTitle = "" }) {
    const path = usePathname();

    return (
        <>
            <Head pageTitle={pageTitle} pageUrl={path} />

            <Nav />

            <main>
                <div className="term-layout-fill">
                    <div className="term-fill">
                        <Terminal
                            key={'project beyond-the-quarks --extended'}
                            width="100%"
                            height="fit-content"
                            user="gianluca@gianlucarainis:~/projects$"
                            command={'project beyond-the-quarks --extended'}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
