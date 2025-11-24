import { Outlet, Link, useOutletContext } from 'react-router-dom';
import { Sun, Moon, ArrowLeft, Palette } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import pkg from '../../package.json';
import ThemeModal from './ThemeModal';

interface LayoutContextType {
    setPageTitle: (title: ReactNode | null) => void;
    setActionButton: (button: ReactNode | null) => void;
}

export function useLayoutContext() {
    return useOutletContext<LayoutContextType>();
}

export default function Layout() {
    const { theme, toggleTheme, accentColor } = useStore();
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const pageTitle = useStore((state) => state.pageTitle);
    const setPageTitle = useStore((state) => state.setPageTitle);
    const actionButton = useStore((state) => state.actionButton);
    const setActionButton = useStore((state) => state.setActionButton);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-accent', accentColor);
    }, [accentColor]);

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
            {/* Compact Header */}
            <header className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between shrink-0 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">Task Manager</h1>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">v{pkg.version}</p>
                        </div>
                    </div>
                    {!isHomePage && (
                        <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    )}
                    {pageTitle && (
                        <div className="ml-2">{pageTitle}</div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {actionButton}

                    <button
                        onClick={() => setIsThemeModalOpen(true)}
                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors relative group"
                        aria-label="Changer l'apparence"
                    >
                        <Palette className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-white dark:ring-neutral-800" />
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Changer de thème"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <Outlet context={{ setPageTitle, setActionButton } satisfies LayoutContextType} />
            </main>

            <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
        </div>
    );
}
