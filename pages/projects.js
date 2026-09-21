import React from 'react';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import { usePathname } from 'next/navigation';
import Terminal from '@/components/Terminal';
import { PROJECTS_INFO_EXTENDED } from '@/components/TerminalCommandsContext';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Projects"
        }
    }
}

export default function ProjectsPage({ pageTitle = "" }) {
    const path = usePathname();

    return (
        <>
            <Head pageTitle={pageTitle} pageUrl={path} />

            <Nav />

            <main>
                <div className="term-layout-fill">
                    <div className="term-fill">
                        {PROJECTS_INFO_EXTENDED.map((terminal) => (
                            <Terminal
                                key={terminal.command}
                                width="100%"
                                height="fit-content"
                                user="gianluca@gianlucarainis:~/projects$"
                                command={terminal.command}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
