import { Outlet, Link } from 'react-router-dom';
import { CheckSquare, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Layout() {
    const { theme, toggleTheme } = useStore();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        console.log('!!! VERSION_DEBUG_CHECK_12345: Frontend is running !!!');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Compact Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between shrink-0 transition-colors">
                <div className="flex items-center gap-3">
                    {!isHomePage && (
                        <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/30">
                            <CheckSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">TaskFlow</h1>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">v0.1.0</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Changer de thème"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <Outlet />
            </main>
        </div>
    );
}
