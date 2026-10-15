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
                            output={`<h1>Project Name</h1><p>Project description goes here.</p><p><span style="opacity:.7">Technologies used</span></p>`}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
