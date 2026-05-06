import React from 'react';
import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Head from '@/components/Head';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Curriculum Vitae"
        }
    }
}

export default function SearchPage({ pageTitle = "Curriculum Vitae" }) {
    const path = usePathname();

    return (
        <>
            <Head pageTitle={`${pageTitle}`} pageUrl={path} />
            <Nav />

            <main>
                <section className="curriculum-page" aria-labelledby="curriculum-title">
                    <header className="curriculum-hero">
                        <p className="curriculum-eyebrow">Curriculum Vitae</p>
                        <h1 id="curriculum-title">Gianluca Rainis</h1>
                        <p className="curriculum-description">
                            View my CV directly in the browser or download a PDF copy to read it offline.
                        </p>

                        <div className="curriculum-actions">
                            <a
                                className="curriculum-button curriculum-button-primary"
                                href="/Gianluca-Rainis-CV.pdf"
                                download="Gianluca-Rainis-CV.pdf"
                            >
                                Download a copy
                            </a>
                            <a
                                className="curriculum-button curriculum-button-primary"
                                href="/contact"
                            >
                                Contact Me
                            </a>
                        </div>
                    </header>

                    <div className="curriculum-preview" aria-label="CV preview">
                        <iframe
                            src="/Gianluca-Rainis-CV.pdf"
                            title="CV of Gianluca Rainis"
                            loading="lazy"
                        >
                            <p className="curriculum-fallback">
                                Your browser does not support PDF preview. You can open or download the file using the button above.
                            </p>
                        </iframe>
                    </div>
                </section>
            </main>
        </>
    );
}