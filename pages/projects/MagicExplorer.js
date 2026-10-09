import React from 'react';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import { usePathname } from 'next/navigation';
import Terminal from '@/components/Terminal';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "MagicExplorer"
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
                            key={'project magicexplorer --extended'}
                            width="100%"
                            height="fit-content"
                            user="gianluca@gianlucarainis:~/projects$"
                            command={'project magicexplorer --extended'}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
