import { X, Check, Palette } from 'lucide-react';
import { useStore } from '../store/useStore';

interface ThemeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const colors = [
    { id: 'gray', name: 'Neutre (Défaut)', bg: 'bg-gray-500' },
    { id: 'blue', name: 'Bleu', bg: 'bg-blue-500' },
    { id: 'green', name: 'Vert', bg: 'bg-green-500' },
    { id: 'purple', name: 'Violet', bg: 'bg-purple-500' },
    { id: 'pink', name: 'Rose', bg: 'bg-pink-500' },
    { id: 'orange', name: 'Orange', bg: 'bg-orange-500' },
    { id: 'red', name: 'Rouge', bg: 'bg-red-500' },
    { id: 'yellow', name: 'Jaune', bg: 'bg-yellow-500' },
    { id: 'cyan', name: 'Cyan', bg: 'bg-cyan-500' },
] as const;

export default function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
    const { accentColor, setAccentColor } = useStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-neutral-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg text-accent-600 dark:text-accent-400">
                            <Palette className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Apparence</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Couleur d'accentuation</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => setAccentColor(color.id)}
                                    className={`
                                        relative flex items-center gap-3 p-3 rounded-xl border transition-all
                                        ${accentColor === color.id
                                            ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20 ring-1 ring-accent-500'
                                            : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700/50'
                                        }
                                    `}
                                >
                                    <div className={`w-6 h-6 rounded-full ${color.bg} shadow-sm shrink-0`} />
                                    <span className={`text-sm font-medium ${accentColor === color.id ? 'text-accent-700 dark:text-accent-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {color.name}
                                    </span>
                                    {accentColor === color.id && (
                                        <div className="absolute right-3 text-accent-600 dark:text-accent-400">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-700">
                        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                            Vos préférences sont synchronisées automatiquement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
