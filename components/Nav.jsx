import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/nav.module.css';
import Calendar from '@/components/Calendar';

export default function Nav() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
        <nav className={styles.nav} aria-label='Primary navigation'>
            <div className={styles.brandWrap}>
                <Link href='/' className={styles.avatarLink} aria-label='Homepage'>
                    <img className={styles.avatar} src='/github_profile_image.png' alt='' aria-hidden='true' />
                </Link>
                <Link href='/' className={styles.brand} aria-label='Homepage'>
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
                <div className={styles.clockWrapper}>
                    <div 
                        className={styles.clock}
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    >
                        {new Date().getDate()} {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getFullYear().toString()}
                    </div>
                    <Calendar 
                        isOpen={isCalendarOpen} 
                        onClose={() => setIsCalendarOpen(false)} 
                    />
                </div>
            </div>
        </nav>
    );
}