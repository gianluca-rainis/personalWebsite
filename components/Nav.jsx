import React from 'react'
import Link from 'next/link'
import styles from '@/styles/nav.module.css'

export default function Nav() {
    return (
        <nav className={styles.nav} aria-label='Primary navigation'>
            <div className={styles.brandWrap}>
                <img className={styles.avatar} src='/icon.png' alt='Gianluca Rainis Icon' aria-hidden='true' />
                <Link href='/' className={styles.brand}>
                    Gianluca Rainis
                </Link>
            </div>

            <div className={styles.links}>
                <a href='https://github.com/gianluca-rainis' target='_blank' rel='noopener noreferrer'>
                    GitHub
                </a>
                <a href='https://www.linkedin.com/in/gianluca-rainis' target='_blank' rel='noopener noreferrer'>
                    LinkedIn
                </a>
            </div>

            <div className={styles.statusArea} aria-hidden='true'>
                <span className={styles.statusIcon} title='Search'>⌕</span>
                <span className={styles.statusIcon} title='Wi-Fi'>⋯</span>
                <span className={styles.statusIcon} title='Theme'>◐</span>
                <span className={styles.statusIcon} title='Battery'>▮▮▮</span>
                <div className={styles.clock}>{new Date().getDate()} {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getFullYear().toString()}</div>
            </div>
        </nav>
    )
}