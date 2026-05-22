import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/terminal.module.css';
import { useTheme } from '@/components/ThemeContext';
import { useTerminalCommands } from '@/components/TerminalCommandsContext';

const THEME_ACCENT_BRIGHT = {
    green: '#00ff00',
    red: '#ff0000',
    yellow: '#ffff00',
    blue: '#0000ff',
};

export default function Terminal({ width, height, user, command }) {
    const [inputValue, setInputValue] = useState('');
    const [sessions, setSessions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [windowState, setWindowState] = useState('normal');
    const [terminalHeight, setTerminalHeight] = useState(100);
    const contentRef = useRef(null);
    const terminalRef = useRef(null);
    const initializedCommandRef = useRef(null);
    const hasLockedHeightRef = useRef(false);
    const { theme } = useTheme();
    const { executeCommand } = useTerminalCommands();

    const accentBrightHex = THEME_ACCENT_BRIGHT[theme] || THEME_ACCENT_BRIGHT.green;

    const terminalStyle = {
        width: width || '100%',
        height: height || 'fit-content',
    };

    const isMinimized = windowState === 'minimized';
    const isMaximized = windowState === 'maximized';
    const isClosed = windowState === 'closed';

    const rootClassName = [
        styles.terminal,
        isVisible ? styles.terminalVisible : styles.terminalHidden,
        isMaximized ? styles.terminalMaximized : '',
        isClosed ? styles.terminalClosed : '',
    ].filter(Boolean).join(' ');

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [sessions, inputValue]);

    useEffect(() => {
        function handleDocumentMouseDown(event) {
            if (!terminalRef.current?.contains(event.target)) {
                setIsFocused(false);
            }
        }

        document.addEventListener('mousedown', handleDocumentMouseDown);
        return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
    }, []);

    useEffect(() => {
        const target = terminalRef.current;

        if (!target) {
            return undefined;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setIsVisible(true);

            return undefined;
        }

        if (!('IntersectionObserver' in window)) {
            setIsVisible(true);
            
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(target);
                }
            },
            {
                threshold: 0.25,
                rootMargin: '0px 0px -8% 0px',
            }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, []);

    function runCommand(commandText) {
        const result = executeCommand(commandText, { accentBrightHex });

        if (result.action === 'clear') {
            setSessions([]);
            return;
        }

        setSessions((prev) => [...prev, result]);
    }

    useEffect(() => {
        if (initializedCommandRef.current === command) {
            return;
        }

        initializedCommandRef.current = command;

        const initialResult = executeCommand(command, { accentBrightHex });

        if (initialResult.action === 'clear') {
            setSessions([]);
            return;
        }

        setSessions(initialResult.outputHtml ? [initialResult] : []);
    }, [command, executeCommand, accentBrightHex]);

    useEffect(() => {
        if (hasLockedHeightRef.current || sessions.length === 0 || !contentRef.current) {
            return;
        }

        setTerminalHeight(contentRef.current.scrollHeight+1);
        hasLockedHeightRef.current = true;
    }, [sessions]);

    function handleKeyDown(e) {
        if (!isFocused || isMinimized || isClosed) {
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            runCommand(inputValue);
            setInputValue('');
            return;
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            setInputValue((prev) => prev.slice(0, -1));
            return;
        }

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            setInputValue((prev) => prev + e.key);
        }
    }

    useEffect(() => {
        if (isClosed) {
            setIsFocused(false);
        }
    }, [isClosed]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, inputValue, isMinimized, isClosed]);

    function toggleMinimize(event) {
        event.stopPropagation();
        setWindowState((prev) => (prev === 'minimized' ? 'normal' : 'minimized'));
    }

    function toggleMaximize(event) {
        event.stopPropagation();
        setWindowState((prev) => (prev === 'maximized' ? 'normal' : 'maximized'));
    }

    function toggleClose(event) {
        event.stopPropagation();
        setWindowState((prev) => (prev === 'closed' ? 'normal' : 'closed'));
    }

    return (
        <section
            className={`${rootClassName} ${isClosed ? styles.displayNone : ''}`}
            style={terminalStyle}
            aria-label="Terminal"
            ref={terminalRef}
            onMouseDown={() => setIsFocused(true)}
            onClick={() => setIsFocused(true)}
        >
            <header className={styles.topBar}>
                <img src="/Terminal.svg" alt="Terminal icon" className={styles.terminalIcon} />
                <p className={styles.title}>terminal</p>
                <div className={styles.windowControls}>
                    <button type="button" className={styles.controlButton} onClick={toggleMinimize} aria-label={isMinimized ? 'Restore terminal' : 'Minimize terminal'}>
                        <img src="/Line.svg" alt="" className={styles.controlIcon} />
                    </button>
                    <button type="button" className={styles.controlButton} onClick={toggleMaximize} aria-label={isMaximized ? 'Reduce terminal' : 'Maximize terminal'}>
                        <img src="/Square.svg" alt="" className={styles.controlIcon} />
                    </button>
                    <button type="button" className={styles.controlButton} onClick={toggleClose} aria-label="Close terminal">
                        <img src="/Close.svg" alt="" className={styles.controlIcon} />
                    </button>
                </div>
            </header>

            {!isMinimized && (
                <div className={styles.content} ref={contentRef} style={{ maxHeight: terminalHeight ? `${terminalHeight}px` : null, minHeight: terminalHeight ? `${terminalHeight}px` : null }}>
                    {sessions.map((session, idx) => (
                        <React.Fragment key={`${session.command}-${idx}`}>
                            {user && (
                                <p className={styles.user}>
                                    {user}
                                    <span>{session.command}</span>
                                </p>
                            )}
                            {session.outputHtml && <div dangerouslySetInnerHTML={{ __html: session.outputHtml }} />}
                        </React.Fragment>
                    ))}
                    <p className={`${styles.user} ${styles.inputLine}`}>
                        <span className={styles.prompt}>{user}</span>
                        <span className={styles.inputText}>{inputValue}</span>
                        {isFocused && <span className={styles.cursor} />}
                    </p>
                </div>
            )}
        </section>
    );
}