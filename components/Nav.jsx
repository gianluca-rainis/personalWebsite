import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from '@/styles/nav.module.css';
import Calendar from '@/components/Calendar';
import WifiPanel from '@/components/WifiPanel';
import ThemePanel from '@/components/ThemePanel';
import { useTheme } from '@/components/ThemeContext';

export default function Nav() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isWifiOpen, setIsWifiOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [wifiSignalLevel, setWifiSignalLevel] = useState(null);
    const [wifiNetworkName, setWifiNetworkName] = useState('Not connected');
    const clockWrapperRef = useRef(null);
    const wifiWrapperRef = useRef(null);
    const themeWrapperRef = useRef(null);
    const { theme, themeTitle } = useTheme();

    function getWifiIconSrc(level) {
        if (level == null || level < 0) {
            return '/NoWifi.svg';
        }

        if (level === 0) {
            return '/Wifi_0.svg';
        }

        if (level === 1) {
            return '/Wifi_1.svg';
        }

        if (level === 2) {
            return '/Wifi_2.svg';
        }

        return '/Wifi_3.svg';
    }

    const wifiIconSrc = getWifiIconSrc(wifiSignalLevel);
    const wifiTitle = wifiSignalLevel > 0?`Wi-Fi: Connected to ${wifiNetworkName}`:'Wi-Fi: Not Connected';

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
                    <button
                        type='button'
                        className={styles.statusButton}
                        onClick={() => setIsWifiOpen(!isWifiOpen)}
                        title={wifiTitle}
                        aria-label={wifiTitle}
                    >
                        <img className={styles.wifiIcon} src={wifiIconSrc} alt='WiFi' aria-hidden='true' />
                    </button>
                    <WifiPanel
                        isOpen={isWifiOpen}
                        onClose={() => setIsWifiOpen(false)}
                        triggerRef={wifiWrapperRef}
                        onSignalChange={(signalLevel, networkName) => {
                            setWifiSignalLevel(signalLevel);
                            setWifiNetworkName(networkName || 'Not connected');
                        }}
                    />
                </div>
                <div className={styles.themeWrapper} ref={themeWrapperRef}>
                    <button
                        type='button'
                        className={styles.statusButton}
                        onClick={() => setIsThemeOpen(!isThemeOpen)}
                        title={themeTitle}
                        aria-label={themeTitle}
                    >
                        ◐
                    </button>
                    <ThemePanel
                        isOpen={isThemeOpen}
                        onClose={() => setIsThemeOpen(false)}
                        triggerRef={themeWrapperRef}
                    />
                </div>
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