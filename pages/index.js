import React, { useEffect } from 'react';
import Nav from '@/components/Nav';

export default function HomePage() {
    return (
        <>
            <Nav />

            <main>
                <img src="/github_profile_image.png" alt="Gianluca Rainis" />
                <h1>Gianluca Rainis</h1>
                <p>This site is still work in progress.</p>
                <p>In the meanwhile you can visit my GitHub and my LinkedIn.</p>
                <p>If you have any questions, feel free to contact me via Email at <a href='mailto:gianluca.rainis@gianlucarainis.com'>gianluca.rainis@gianlucarainis.com</a>.</p>
                <div className='social-links'>
                    <a href='mailto:gianluca.rainis@gianlucarainis.com' target='_blank' rel='noopener noreferrer'>
                        <img src='https://skillicons.dev/icons?i=gmail' alt='Gmail' />
                    </a>
                    <a href='https://github.com/gianluca-rainis' target='_blank' rel='noopener noreferrer'>
                        <img src='https://skillicons.dev/icons?i=github' alt='Github' />
                    </a>
                    <a href='https://www.linkedin.com/in/gianluca-rainis' target='_blank' rel='noopener noreferrer'>
                        <img src='https://skillicons.dev/icons?i=linkedin' alt='LinkedIn' />
                    </a>
                </div>
            </main>
        </>
    );
}