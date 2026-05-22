import React from 'react';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import { usePathname } from 'next/navigation';
import Terminal from '@/components/Terminal';

const SIDEBAR_TERMINALS = [
    { command: 'image --ascii', width: 'auto' },
    { command: 'info --personal', width: 'auto' },
    { command: 'info --contact', width: 'auto' },
    { command: 'keyboard --language', width: 'auto' },
    { command: 'image --profile --ascii', width: 'auto' },
    { command: 'cat hackclub.txt', width: '100%' },
];

const MAIN_TERMINALS = [
    { command: 'info' },
    { command: 'presentation --about' },
    { command: 'skills --table' },
    { command: 'info --education' },
    { command: 'info --work' },
    { command: 'info --certifications' },
    { command: 'ls projects/' },
    { command: 'info --hobbies' },
];

export async function getStaticProps() {
    return {
        props: {
            pageTitle: ""
        }
    }
}

export default function HomePage({ pageTitle = "" }) {
    const path = usePathname();

    return (
        <>
            <Head pageTitle={pageTitle} pageUrl={path} />

            <Nav />

            <main>
                <div className="term-layout">
                    <aside className="term-sidebar">
                        {SIDEBAR_TERMINALS.map((terminal) => (
                            <Terminal
                                key={terminal.command}
                                width={terminal.width}
                                height="fit-content"
                                user="gianluca@gianlucarainis:~$"
                                command={terminal.command}
                            />
                        ))}
                    </aside>

                    <div className="term-right">
                        {MAIN_TERMINALS.map((terminal) => (
                            <Terminal
                                key={terminal.command}
                                width="100%"
                                height="fit-content"
                                user="gianluca@gianlucarainis:~$"
                                command={terminal.command}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}