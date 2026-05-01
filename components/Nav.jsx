import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/nav.module.css';
import Calendar from '@/components/Calendar';
import WifiPanel from '@/components/WifiPanel';
import ThemePanel from '@/components/ThemePanel';
import BatteryPanel from '@/components/BatteryPanel';
import { useTheme } from '@/components/ThemeContext';

export default function Nav() {
    const router = useRouter();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isWifiOpen, setIsWifiOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [isBatteryOpen, setIsBatteryOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [wifiSignalLevel, setWifiSignalLevel] = useState(null);
    const [wifiNetworkName, setWifiNetworkName] = useState('Not connected');
    const [batteryPercentage, setBatteryPercentage] = useState(100);
    const [isPowerSaveEnabled, setIsPowerSaveEnabled] = useState(false);
    const hasManuallyDisabledPowerSaveRef = useRef(false);
    const clockWrapperRef = useRef(null);
    const wifiWrapperRef = useRef(null);
    const themeWrapperRef = useRef(null);
    const batteryWrapperRef = useRef(null);
    const searchWrapperRef = useRef(null);
    const searchInputRef = useRef(null);
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

    useEffect(() => {
        if (batteryPercentage <= 1) {
            return undefined;
        }

        const drainInterval = isPowerSaveEnabled ? 5 * 60 * 1000 : 30 * 1000;

        const batteryTimeout = setTimeout(() => {
            setBatteryPercentage(prevPercentage => Math.max(prevPercentage - 1, 1));
        }, drainInterval);

        return () => clearTimeout(batteryTimeout);
    }, [batteryPercentage, isPowerSaveEnabled]);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        }

        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }

            if (e.key === 'Enter' && searchQuery.trim()) {
                handleSearch();
            }
        }

        if (isSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSearchOpen, searchQuery]);

    useEffect(() => {
        if (batteryPercentage <= 20 && !isPowerSaveEnabled && !hasManuallyDisabledPowerSaveRef.current) {
            setIsPowerSaveEnabled(true);
        }
    }, [batteryPercentage, isPowerSaveEnabled]);

    useEffect(() => {
        const resolvedTheme = isPowerSaveEnabled ? 'yellow' : theme;

        document.documentElement.setAttribute('data-theme', resolvedTheme);
        document.documentElement.setAttribute('data-power-save', isPowerSaveEnabled ? 'true' : 'false');

        return () => {
            document.documentElement.removeAttribute('data-power-save');
        };
    }, [theme, isPowerSaveEnabled]);

    function handlePowerSaveChange(nextEnabled) {
        if (!nextEnabled) {
            hasManuallyDisabledPowerSaveRef.current = true;
        }

        setIsPowerSaveEnabled(nextEnabled);
    }

    function handleSearch() {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
        else {
            router.push(`/search`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    }

    function getBatteryIconSrc(percentage) {
        if (percentage <= 20) {
            return '/Battery_1.svg';
        }

        if (percentage <= 40) {
            return '/Battery_2.svg';
        }

        if (percentage <= 60) {
            return '/Battery_3.svg';
        }

        if (percentage <= 80) {
            return '/Battery_4.svg';
        }

        return '/Battery_5.svg';
    }

    const wifiIconSrc = getWifiIconSrc(wifiSignalLevel);
    const batteryIconSrc = getBatteryIconSrc(batteryPercentage);
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
                <div className={styles.searchWrapper} ref={searchWrapperRef}>
                    <button
                        type='button'
                        className={styles.statusButton}
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        title='Search'
                        aria-label='Search'
                    >
                        <img className={styles.searchIcon} src='/Search.svg' alt='Search' aria-hidden='true' />
                    </button>
                    {isSearchOpen && (
                        <div className={styles.searchPanel}>
                            <input
                                ref={searchInputRef}
                                type='text'
                                className={styles.searchInput}
                                placeholder='Search...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label='Search query'
                            />
                            <button
                                type='button'
                                className={styles.searchButton}
                                onClick={handleSearch}
                                aria-label='Submit search'
                            >
                                <img src='/Search.svg' alt='' aria-hidden='true' />
                            </button>
                        </div>
                    )}
                </div>
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
                        <img className={styles.themeIcon} src='/Theme.svg' alt='Theme' aria-hidden='true' />
                    </button>
                    <ThemePanel
                        isOpen={isThemeOpen}
                        onClose={() => setIsThemeOpen(false)}
                        triggerRef={themeWrapperRef}
                    />
                </div>
                <div className={styles.batteryWrapper} ref={batteryWrapperRef}>
                    <button
                        type='button'
                        className={styles.statusButton}
                        onClick={() => setIsBatteryOpen(!isBatteryOpen)}
                        title={`Battery: ${batteryPercentage}%`}
                        aria-label={`Battery: ${batteryPercentage}%`}
                    >
                        <img className={styles.batteryIcon} src={batteryIconSrc} alt='Battery' aria-hidden='true' />
                    </button>
                    <BatteryPanel
                        isOpen={isBatteryOpen}
                        onClose={() => setIsBatteryOpen(false)}
                        triggerRef={batteryWrapperRef}
                        batteryPercentage={batteryPercentage}
                        onPowerSaveChange={handlePowerSaveChange}
                        isPowerSaveEnabled={isPowerSaveEnabled}
                    />
                </div>
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