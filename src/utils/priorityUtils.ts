/**
 * Retourne la couleur Tailwind appropriée pour une priorité donnée
 * Échelle: 1 (vert) → 2 (vert clair) → 3 (jaune) → 4 (orange) → 5 (rouge)
 */
export function getPriorityColor(priority: number = 3): {
    bg: string;
    text: string;
    border: string;
} {
    switch (priority) {
        case 1:
            return {
                bg: 'bg-green-100 dark:bg-green-900/30',
                text: 'text-green-700 dark:text-green-400',
                border: 'border-green-300 dark:border-green-700'
            };
        case 2:
            return {
                bg: 'bg-lime-100 dark:bg-lime-900/30',
                text: 'text-lime-700 dark:text-lime-400',
                border: 'border-lime-300 dark:border-lime-700'
            };
        case 3:
            return {
                bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                text: 'text-yellow-700 dark:text-yellow-400',
                border: 'border-yellow-300 dark:border-yellow-700'
            };
        case 4:
            return {
                bg: 'bg-orange-100 dark:bg-orange-900/30',
                text: 'text-orange-700 dark:text-orange-400',
                border: 'border-orange-300 dark:border-orange-700'
            };
        case 5:
            return {
                bg: 'bg-red-100 dark:bg-red-900/30',
                text: 'text-red-700 dark:text-red-400',
                border: 'border-red-300 dark:border-red-700'
            };
        default:
            return {
                bg: 'bg-gray-100 dark:bg-gray-900/30',
                text: 'text-gray-700 dark:text-gray-400',
                border: 'border-gray-300 dark:border-gray-700'
            };
    }
}

/**
 * Retourne le label textuel pour une priorité donnée
 */
export function getPriorityLabel(priority: number = 3): string {
    switch (priority) {
        case 1:
            return 'Très basse';
        case 2:
            return 'Basse';
        case 3:
            return 'Moyenne';
        case 4:
            return 'Haute';
        case 5:
            return 'Très haute';
        default:
            return 'Non définie';
    }
}

/**
 * Retourne la couleur pour le slider de priorité
 */
export function getPrioritySliderColor(priority: number = 3): string {
    switch (priority) {
        case 1:
            return '#22c55e'; // green-500
        case 2:
            return '#84cc16'; // lime-500
        case 3:
            return '#eab308'; // yellow-500
        case 4:
            return '#f97316'; // orange-500
        case 5:
            return '#ef4444'; // red-500
        default:
            return '#6b7280'; // gray-500
    }
}
