import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Head from '@/components/Head';

const curriculumVersions = {
    en: {
        label: 'English version',
        fileName: 'Gianluca-Rainis-CV-EN.pdf',
        href: '/Gianluca-Rainis-CV-EN.pdf',
    },
    it: {
        label: 'Italian version',
        fileName: 'Gianluca-Rainis-CV.pdf',
        href: '/Gianluca-Rainis-CV.pdf',
    },
};

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Curriculum Vitae"
        }
    }
}

export default function SearchPage({ pageTitle = "Curriculum Vitae" }) {
    const path = usePathname();
    const [selectedVersion, setSelectedVersion] = useState('en');
    const currentVersion = curriculumVersions[selectedVersion];

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
                            Choose the version you want to view in the browser or download it to read it offline.
                        </p>

                        <div className="curriculum-version-switch" role="group" aria-label="Choose CV language">
                            <button
                                type="button"
                                className={`curriculum-button curriculum-version-button${selectedVersion === 'en' ? ' is-active' : ''}`}
                                aria-pressed={selectedVersion === 'en'}
                                onClick={() => setSelectedVersion('en')}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                className={`curriculum-button curriculum-version-button${selectedVersion === 'it' ? ' is-active' : ''}`}
                                aria-pressed={selectedVersion === 'it'}
                                onClick={() => setSelectedVersion('it')}
                            >
                                Italian
                            </button>
                        </div>

                        <p className="curriculum-version-label" aria-live="polite">
                            Currently showing: {currentVersion.label}
                        </p>

                        <div className="curriculum-actions">
                            <a
                                className="curriculum-button curriculum-button-primary"
                                href={currentVersion.href}
                                download={currentVersion.fileName}
                            >
                                Download the CV ({currentVersion.label.toLowerCase()})
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
                            src={currentVersion.href}
                            title="CV of Gianluca Rainis"
                            loading="lazy"
                        />
                    </div>
                </section>
            </main>
        </>
    );
}