import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../types';
import { Clock, Trash2, Pen } from 'lucide-react';
import { getPriorityColor, getPriorityLabel } from '../utils/priorityUtils';

interface TaskCardProps {
    task: Task;
    index: number;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
}

export default function TaskCard({ task, index, onDelete, onEdit }: TaskCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongDescription = task.description.length > 150;
    const priorityColors = getPriorityColor(task.priority);

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 mb-3 group hover:shadow-md dark:hover:shadow-blue-500/20 transition-all neon-card-hover ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 rotate-2 z-50' : ''
                        }`}
                    style={provided.draggableProps.style}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mb-3">
                        <p className={`text-xs text-gray-500 dark:text-gray-400 ${!isExpanded && isLongDescription ? 'line-clamp-3' : ''}`}>
                            {task.description}
                        </p>
                        {isLongDescription && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-medium"
                            >
                                {isExpanded ? 'Voir moins' : 'Voir plus'}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(task.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>

                            {/* Indicateur de priorité */}
                            <div
                                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}`}
                                title={getPriorityLabel(task.priority)}
                            >
                                P{task.priority || 3}
                            </div>
                        </div>

                        {/* Icône d'édition */}
                        <button
                            onClick={() => onEdit(task)}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Modifier la tâche"
                        >
                            <Pen className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
