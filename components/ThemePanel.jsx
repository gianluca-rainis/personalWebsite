import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeContext';
import styles from '@/styles/nav.module.css';

export default function ThemePanel({ isOpen, onClose, triggerRef }) {
    const panelRef = useRef(null);
    const { theme, setTheme, themeOptions } = useTheme();

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
        <div className={styles.themePanel} ref={panelRef}>
            <div className={styles.themeHeader}>
                <div className={styles.themeTitle}>Color theme</div>
                <div className={styles.themeSubtitle}>Choose an accent</div>
            </div>

            <div className={styles.themeList}>
                {themeOptions.map((option) => {
                    const isActive = theme === option.id;

                    return (
                        <button
                            key={option.id}
                            type='button'
                            className={`${styles.themeOption} ${isActive ? styles.themeOptionActive : ''}`}
                            onClick={() => {
                                setTheme(option.id);
                                onClose();
                            }}
                            aria-pressed={isActive}
                        >
                            <span className={styles.themeOptionTopLine}>
                                <span className={styles.themeOptionName}>{option.name}</span>
                                <span className={styles.themeOptionSwatch} data-theme-option={option.id} />
                            </span>
                            <span className={styles.themeOptionMeta}>{option.description}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}