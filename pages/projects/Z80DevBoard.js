import React from 'react';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import { usePathname } from 'next/navigation';
import Terminal from '@/components/Terminal';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Z80DevBoard"
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
                            key={'project z80devboard --extended'}
                            width="100%"
                            height="fit-content"
                            user="gianluca@gianlucarainis:~/projects$"
                            command={'project z80devboard --extended'}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
