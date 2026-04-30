import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/wifi.module.css';

export default function WifiPanel({ isOpen, onClose, triggerRef }) {
    const [lastCheckedAt, setLastCheckedAt] = useState(new Date());
    const panelRef = useRef(null);

    function handleRefresh() {
        setLastCheckedAt(new Date());
    }

    useEffect(() => {
        function handleClickOutside(event) {
            const isClickOnPanel = panelRef.current && panelRef.current.contains(event.target);
            const isClickOnTrigger = triggerRef?.current && triggerRef.current.contains(event.target);

            if (!isClickOnPanel && !isClickOnTrigger) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, onClose, triggerRef]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.wifiContainer} ref={panelRef}>
            <div className={styles.header}>
                <div className={styles.title}>Wi-Fi</div>
                <span className={styles.status}>No networks available</span>
            </div>

            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>◌</div>
                <div className={styles.emptyText}>
                    <strong>No networks found</strong>
                    <span>The device cannot detect any nearby wireless networks.</span>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.lastChecked}>
                    Last checked {lastCheckedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <button onClick={handleRefresh} className={styles.refreshButton} type='button'>
                    Refresh
                </button>
            </div>
        </div>
    );
}