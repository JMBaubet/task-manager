import { Outlet, Link } from 'react-router-dom';
import { Layout as LayoutIcon, CheckSquare, Sun, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

export default function Layout() {
    const { theme, toggleTheme } = useStore();

    useEffect(() => {
        console.log('!!! VERSION_DEBUG_CHECK_12345: Frontend is running !!!');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-colors duration-300">
                <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
                            <CheckSquare className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">TaskFlow</h1>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Changer de thème"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all hover:shadow-md dark:hover:shadow-blue-500/10"
                    >
                        <LayoutIcon className="w-5 h-5" />
                        <span className="font-medium">Projets</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-xs text-gray-400 dark:text-gray-500">v0.1.0</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
                <Outlet />
                {/* Emergency Floating Toggle */}
                <button
                    onClick={toggleTheme}
                    className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 z-50 flex items-center justify-center transition-transform hover:scale-110"
                    title="Changer de thème (Secours)"
                >
                    {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
            </main>
        </div>
    );
}
