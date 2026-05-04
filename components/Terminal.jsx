import React from 'react';
import styles from '@/styles/terminal.module.css';

export default function Terminal({ width, height, user, terminalContent }) {
    const terminalStyle = {
        width: width || '100%',
        height: height || '100%',
    };

    return (
        <section className={styles.terminal} style={terminalStyle} aria-label="Terminale">
            <header className={styles.topBar}>
                <img src="/Terminal.svg" alt="" className={styles.terminalIcon} />
                <p className={styles.title}>terminal</p>
                <div className={styles.windowControls} aria-hidden="true">
                    <img src="/Line.svg" alt="" className={styles.controlIcon} />
                    <img src="/Square.svg" alt="" className={styles.controlIcon} />
                    <img src="/Close.svg" alt="" className={styles.controlIcon} />
                </div>
            </header>

            <div className={styles.content}>
                {user && <p className={styles.user}>{user}</p>}
                {typeof terminalContent === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: terminalContent }} />
                ) : (
                    terminalContent
                )}
            </div>
        </section>
    );
}