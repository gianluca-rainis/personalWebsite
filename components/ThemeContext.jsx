import React, { createContext, useContext, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'personalWebsiteTheme';
const THEME_DEFINITIONS = {
    green: {
        id: 'green',
        name: 'Dark green',
        title: 'Theme: Dark green',
        description: 'Neon green accents - bold, energetic, and hacker-ready',
    },
    red: {
        id: 'red',
        name: 'Dark red',
        title: 'Theme: Dark red',
        description: 'Smoldering red accents - warm, striking, and confidently dramatic',
    },
    yellow: {
        id: 'yellow',
        name: 'Dark yellow',
        title: 'Theme: Dark yellow',
        description: 'Vibrant yellow accents - cheerful, eye-catching, and playfully energetic',
    },
};
const VALID_THEMES = new Set(Object.keys(THEME_DEFINITIONS));
const ThemeContext = createContext(null);

function getInitialTheme() {
    if (typeof window === 'undefined') {
        return 'green';
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return VALID_THEMES.has(storedTheme) ? storedTheme : 'green';
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const themeDef = THEME_DEFINITIONS[theme] || THEME_DEFINITIONS.green;

    const value = {
        theme,
        setTheme,
        themeTitle: themeDef.title,
        themeName: themeDef.name,
        themeOptions: Object.values(THEME_DEFINITIONS),
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}