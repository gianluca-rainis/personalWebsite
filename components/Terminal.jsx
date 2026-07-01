import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styles from '@/styles/terminal.module.css';
import { useTheme } from '@/components/ThemeContext';
import { useTerminalCommands } from '@/components/TerminalCommandsContext';

const THEME_ACCENT_BRIGHT = {
    green: '#00ff00',
    red: '#ff0000',
    yellow: '#ffff00',
    blue: '#0000ff',
};

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Terminal({ width, height, user, command }) {
    const { theme } = useTheme();
    const { executeCommand } = useTerminalCommands();

    const accentBrightHex = THEME_ACCENT_BRIGHT[theme] || THEME_ACCENT_BRIGHT.green;

    const [inputValue, setInputValue] = useState('');
    const [sessions, setSessions] = useState(() => {
        const result = executeCommand(command, { accentBrightHex });

        if (result.action === 'clear') {
            return [];
        }

        return result.outputHtml ? [result] : [];
    });
    const [isFocused, setIsFocused] = useState(false);
    const [windowState, setWindowState] = useState('normal');
    const [terminalHeight, setTerminalHeight] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [isFullWidth, setIsFullWidth] = useState(false);
    const contentRef = useRef(null);
    const terminalRef = useRef(null);
    const initializedCommandRef = useRef(command);
    const hasLockedHeightRef = useRef(false);

    const terminalStyle = {
        width: width || '100%',
        height: height || 'fit-content',
    };

    const isMinimized = windowState === 'minimized';
    const isMaximized = windowState === 'maximized';
    const isClosed = windowState === 'closed';

    const rootClassName = [
        styles.terminal,
        isReady ? styles.terminalVisible : styles.terminalHidden,
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
        hasLockedHeightRef.current = false;
        setTerminalHeight(null);
        setIsReady(false);
    }, [command, executeCommand, accentBrightHex]);

    useEffect(() => {
        setSessions((prev) => prev.map((session) => {
            if (!session || session.command !== 'info') {
                return session;
            }

            const updated = executeCommand(session.command, { accentBrightHex });

            if (updated.action === 'clear') {
                return updated;
            }

            return updated;
        }));
    }, [accentBrightHex, executeCommand]);

    useIsomorphicLayoutEffect(() => {
        if (hasLockedHeightRef.current || !contentRef.current) {
            return;
        }

        setTerminalHeight(contentRef.current.scrollHeight + 1);
        hasLockedHeightRef.current = true;
        setIsReady(true);
    }, [sessions]);

    // Expand terminals to fill column
    useEffect(() => {
        function updateFullWidth() {
            const el = terminalRef.current;
            
            if (!el) {
                return;
            }

            const layout = document.querySelector('.term-layout');
            const sidebar = document.querySelector('.term-sidebar');
            const right = document.querySelector('.term-right');

            if (!layout || !sidebar || !right) {
                return;
            }

            const termRect = el.getBoundingClientRect();
            const layoutStyle = getComputedStyle(layout);
            const gap = parseFloat(layoutStyle.gap) || 0;

            const inRight = !!el.closest('.term-right');
            const inSidebar = !!el.closest('.term-sidebar');

            // Clear inline styles
            function clearStyles() {
                el.style.width = '';
                el.style.marginLeft = '';
                el.style.marginRight = '';

                if (isFullWidth) {
                    setIsFullWidth(false);
                }
            }

            if (inRight) {
                if (window.innerWidth < 900) {
                    clearStyles();
                    return;
                }

                const sidebarRect = sidebar.getBoundingClientRect();
                const sidebarChildren = Array.from(sidebar.children || []);
                const overlaps = sidebarChildren.some((child) => {
                    const cRect = child.getBoundingClientRect();
                    return cRect.top < termRect.bottom && cRect.bottom > termRect.top;
                });

                if (!overlaps) {
                    const extra = Math.round(sidebarRect.width + gap);

                    el.style.width = `calc(100% + ${extra}px)`;
                    el.style.marginLeft = `-${extra}px`;
                    el.style.marginRight = '';

                    if (!isFullWidth) {
                        setIsFullWidth(true);
                    }
                }
                else {
                    clearStyles();
                }

                return;
            }

            if (inSidebar) {
                if (window.innerWidth < 900) {
                    clearStyles();
                    return;
                }

                const rightRect = right.getBoundingClientRect();
                const rightChildren = Array.from(right.children || []);
                const overlaps = rightChildren.some((child) => {
                    const cRect = child.getBoundingClientRect();
                    return cRect.top < termRect.bottom && cRect.bottom > termRect.top;
                });

                if (!overlaps) {
                    const extra = Math.round(rightRect.width + gap);

                    el.style.width = `calc(100% + ${extra}px)`;
                    el.style.marginRight = `-${extra}px`;
                    el.style.marginLeft = '';

                    if (!isFullWidth) {
                        setIsFullWidth(true);
                    }
                }
                else {
                    clearStyles();
                }

                return;
            }

            clearStyles();
        }

        updateFullWidth();
        window.addEventListener('resize', updateFullWidth);

        const sidebarEl = document.querySelector('.term-sidebar');
        const rightEl = document.querySelector('.term-right');
        const ro = new (window.ResizeObserver || class {
            observe() {}
            disconnect() {}
        })(() => updateFullWidth());

        if (sidebarEl) {
            ro.observe(sidebarEl);
        }

        if (rightEl) {
            ro.observe(rightEl);
        }

        return () => {
            window.removeEventListener('resize', updateFullWidth);
            ro.disconnect();
        };
    }, [sessions, width, height, isFullWidth]);

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