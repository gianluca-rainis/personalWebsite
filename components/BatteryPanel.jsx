import React, { useEffect, useRef } from 'react';
import styles from '@/styles/nav.module.css';

export default function BatteryPanel({ isOpen, onClose, triggerRef, batteryPercentage, onPowerSaveChange, isPowerSaveEnabled }) {
    const panelRef = useRef(null);

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

    const percentage = batteryPercentage;
    const powerSaveLabel = isPowerSaveEnabled ? 'On' : 'Off';

    return (
        <div className={styles.batteryPanel} ref={panelRef}>
            <div className={styles.batteryHeader}>
                <div className={styles.batteryTitle}>Battery</div>
                <div className={styles.batteryPercentage}>{percentage}%</div>
            </div>

            <div className={styles.batteryBar}>
                <div className={styles.batteryFill} style={{ width: `${percentage}%` }} />
            </div>

            <button
                type='button'
                className={`${styles.powerSaveButton} ${isPowerSaveEnabled ? styles.powerSaveButtonActive : ''}`}
                onClick={() => onPowerSaveChange(!isPowerSaveEnabled)}
                title={isPowerSaveEnabled ? 'Power Save: On' : 'Power Save: Off'}
            >
                <span className={styles.powerSaveLabel}>Power Save</span>
                <span className={styles.powerSaveToggle}>{powerSaveLabel}</span>
            </button>
        </div>
    );
}
