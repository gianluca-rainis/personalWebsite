import React from 'react';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import { usePathname } from 'next/navigation';
import Terminal from '@/components/Terminal';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Project Name"
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
                            key={'project ProjectName --extended'}
                            width="100%"
                            height="fit-content"
                            user="gianluca@gianlucarainis:~/projects$"
                            command={'project ProjectName --extended'}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
