import React, { useEffect } from 'react'

export default function HomePage() {
    return (
        <>
            <main>
                <img src="/icon.png" alt="Gianluca Rainis" />
                <h1>Gianluca Rainis</h1>
                <p>This site is still work in progress.</p>
                <p>In the meanwhile you can visit my GitHub and my LinkedIn.</p>
                <div className='social-links'>
                    <a href='https://github.com/gianluca-rainis' target='_blank' rel='noopener noreferrer'>
                        <img src='https://skillicons.dev/icons?i=github' alt='Github' />
                    </a>
                    <a href='https://www.linkedin.com/in/gianluca-rainis' target='_blank' rel='noopener noreferrer'>
                        <img src='https://skillicons.dev/icons?i=linkedin' alt='LinkedIn' />
                    </a>
                </div>
            </main>
        </>
    )
}