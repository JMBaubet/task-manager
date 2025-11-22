import { Droppable } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface ColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onAddTask: (status: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
    onEditTask: (task: Task) => void;
}

export default function Column({ title, status, tasks, onAddTask, onDeleteTask, onEditTask }: ColumnProps) {
    return (
        <div className="w-72 flex flex-col h-full max-h-full">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
                    <span className="bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full font-medium">
                        {tasks.length}
                    </span>
                </div>
                <button
                    onClick={() => onAddTask(status)}
                    className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 rounded hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 bg-gray-100/50 dark:bg-slate-800/50 rounded-xl p-2 overflow-y-auto transition-colors border border-transparent ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-100 dark:ring-blue-900' : ''
                            }`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                onDelete={onDeleteTask}
                                onEdit={onEditTask}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
