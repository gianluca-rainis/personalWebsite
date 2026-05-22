import '@/styles/styles.css';
import { ThemeProvider } from '@/components/ThemeContext';
import { TerminalCommandsProvider } from '@/components/TerminalCommandsContext';

export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <TerminalCommandsProvider>
                <Component {...pageProps} />
            </TerminalCommandsProvider>
        </ThemeProvider>
    );
}