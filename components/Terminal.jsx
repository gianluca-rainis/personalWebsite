import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/terminal.module.css';

export default function Terminal({ width, height, user, command, terminalContent }) {
    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState([]);
    const contentRef = useRef(null);
    const terminalRef = useRef(null);
    const [terminalHeight, setTerminalHeight] = useState(0);

    const terminalStyle = {
        width: width || '100%',
        height: height || 'fit-content',
    };

    // Auto-scroll to bottom
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [history, inputValue]);

    useEffect(() => {
        if (contentRef.current) {
            setTerminalHeight(contentRef.current.getBoundingClientRect().height);
        }
    }, []);

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (inputValue.trim()) {
                setHistory([...history, inputValue]);
                setInputValue('');
            }
        }
        else if (e.key === 'Backspace') {
            e.preventDefault();

            setInputValue(inputValue.slice(0, -1));
        }
    }

    function handleKeyPress(e) {
        if (e.key.length === 1) {
            e.preventDefault();

            setInputValue(inputValue + e.key);
        }
    }

    return (
        <section 
            className={styles.terminal} 
            style={terminalStyle} 
            aria-label="Terminale"
            ref={terminalRef}
            onClick={() => terminalRef.current?.querySelector(`.${styles.inputLine}`)?.focus()}
        >
            <header className={styles.topBar}>
                <img src="/Terminal.svg" alt="" className={styles.terminalIcon} />
                <p className={styles.title}>terminal</p>
                <div className={styles.windowControls} aria-hidden="true">
                    <img src="/Line.svg" alt="" className={styles.controlIcon} />
                    <img src="/Square.svg" alt="" className={styles.controlIcon} />
                    <img src="/Close.svg" alt="" className={styles.controlIcon} />
                </div>
            </header>

            <div className={styles.content} ref={contentRef} style={{maxHeight: terminalHeight ? `${terminalHeight}px` : null}}>
                {user && <p className={styles.user}>{user} {command}</p>}
                {typeof terminalContent === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: terminalContent }} />
                ) : (
                    terminalContent
                )}
                {history.map((cmd, idx) => (
                    <p key={idx} className={styles.user}>
                        {user}
                        <span>{cmd}</span>
                    </p>
                ))}
                <p className={`${styles.user} ${styles.inputLine}`}>
                    {user}
                    <span>{inputValue}</span>
                    <span className={styles.cursor}></span>
                </p>
            </div>
        </section>
    );
}