import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from '@/styles/nav.module.css';
import Calendar from '@/components/Calendar';
import WifiPanel from '@/components/WifiPanel';

export default function Nav() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isWifiOpen, setIsWifiOpen] = useState(false);
    const clockWrapperRef = useRef(null);
    const wifiWrapperRef = useRef(null);

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

            <div className={styles.statusArea}>
                <span className={styles.statusIcon} title='Search'>⌕</span>
                <div className={styles.wifiWrapper} ref={wifiWrapperRef}>
                    <div
                        className={styles.statusButton}
                        onClick={() => setIsWifiOpen(!isWifiOpen)}
                        title='Wi-Fi'
                    >
                        ⋯
                    </div>
                    <WifiPanel
                        isOpen={isWifiOpen}
                        onClose={() => setIsWifiOpen(false)}
                        triggerRef={wifiWrapperRef}
                    />
                </div>
                <span className={styles.statusIcon} title='Theme'>◐</span>
                <span className={styles.statusIcon} title='Battery'>▮▮▮</span>
                <div className={styles.clockWrapper} ref={clockWrapperRef}>
                    <div 
                        className={styles.clock}
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        title={`${new Date().getDate()} ${new Date().toLocaleString('en-US', { month: 'long' })} ${new Date().getFullYear().toString()}`}
                    >
                        {new Date().getDate()} {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getFullYear().toString()}
                    </div>
                    <Calendar 
                        isOpen={isCalendarOpen} 
                        onClose={() => setIsCalendarOpen(false)}
                        triggerRef={clockWrapperRef}
                    />
                </div>
            </div>
        </nav>
    );
}