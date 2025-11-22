import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../types';
import { Clock, Trash2 } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    index: number;
    onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, index, onDelete }: TaskCardProps) {
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

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-3">{task.description}</p>

                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(task.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
