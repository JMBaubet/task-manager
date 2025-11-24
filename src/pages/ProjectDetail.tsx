import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useStore } from '../store/useStore';
import { Plus } from 'lucide-react';
import Column from '../components/Column';
import { Task, TaskStatus } from '../types';
import { getPrioritySliderColor, getPriorityLabel } from '../utils/priorityUtils';
import { useLayoutContext } from '../components/Layout';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const { projects, moveTask, addTask, deleteTask, updateTask } = useStore();
    const project = projects.find(p => p.id === id);
    const { setPageTitle, setActionButton } = useLayoutContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
    const [formData, setFormData] = useState({ title: '', description: '', priority: 3 });
    const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);

    // États pour l'édition
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editFormData, setEditFormData] = useState({ title: '', description: '', priority: 3 });

    // Configure header with project name and description
    useEffect(() => {
        if (project) {
            setPageTitle(
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">{project.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{project.description}</span>
                </div>
            );
            setActionButton(null);
        }

        // Cleanup on unmount
        return () => {
            setPageTitle(null);
            setActionButton(null);
        };
    }, [project, setPageTitle, setActionButton]);


    if (!project) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Projet introuvable</h2>
                <Link to="/" className="text-accent-600 dark:text-accent-400 hover:underline mt-4 block">Retour au Tableau de Bord</Link>
            </div>
        );
    }

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        moveTask(
            project.id,
            draggableId,
            destination.droppableId as TaskStatus,
            destination.index
        );
    };

    const handleAddTask = (status: TaskStatus) => {
        setNewTaskStatus(status);
        setFormData({ title: '', description: '', priority: 3 });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            addTask(id, formData.title, formData.description, newTaskStatus, formData.priority);
            setIsModalOpen(false);
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setEditFormData({
            title: task.title,
            description: task.description,
            priority: task.priority || 3
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (id && editingTask) {
            updateTask(id, editingTask.id, {
                title: editFormData.title,
                description: editFormData.description,
                priority: editFormData.priority
            });
            setIsEditModalOpen(false);
            setEditingTask(null);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        setDeleteConfirmTaskId(taskId);
    };

    const confirmDeleteTask = () => {
        if (id && deleteConfirmTaskId) {
            deleteTask(id, deleteConfirmTaskId);
            setDeleteConfirmTaskId(null);
        }
    };

    const tasksByStatus = {
        todo: project.tasks.filter(t => t.status === 'todo'),
        'in-progress': project.tasks.filter(t => t.status === 'in-progress'),
        done: project.tasks.filter(t => t.status === 'done'),
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 p-3 overflow-x-auto bg-gray-50 dark:bg-neutral-900 transition-colors">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-3 h-full min-w-fit">
                        <Column
                            title="À Faire"
                            status="todo"
                            tasks={tasksByStatus.todo}
                            onAddTask={handleAddTask}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={handleEditTask}
                        />
                        <Column
                            title="En Cours"
                            status="in-progress"
                            tasks={tasksByStatus['in-progress']}
                            onAddTask={handleAddTask}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={handleEditTask}
                        />
                        <Column
                            title="Terminé"
                            status="done"
                            tasks={tasksByStatus.done}
                            onAddTask={handleAddTask}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={handleEditTask}
                        />
                    </div>
                </DragDropContext>
            </div>

            {/* Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl dark:shadow-accent-900/20 w-full max-w-md overflow-hidden border dark:border-neutral-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nouvelle Tâche</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all"
                                    placeholder="Titre de la tâche"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all"
                                    placeholder="Détails de la tâche..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Priorité : <span className="font-semibold" style={{ color: getPrioritySliderColor(formData.priority) }}>{getPriorityLabel(formData.priority)}</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #22c55e 0%, #84cc16 25%, #eab308 50%, #f97316 75%, #ef4444 100%)`,
                                        }}
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">5</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 hover:shadow-lg hover:shadow-accent-500/30 font-medium transition-colors"
                                >
                                    Créer la Tâche
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Task Confirmation Modal */}
            {deleteConfirmTaskId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl dark:shadow-accent-900/20 w-full max-w-md overflow-hidden border dark:border-neutral-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirmer la suppression</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 dark:text-gray-300">
                                Êtes-vous sûr de vouloir supprimer cette tâche ?
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                Cette action est irréversible.
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirmTaskId(null)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDeleteTask}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {isEditModalOpen && editingTask && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl dark:shadow-accent-900/20 w-full max-w-md overflow-hidden border dark:border-neutral-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Modifier la Tâche</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTask} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                                <input
                                    type="text"
                                    required
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all"
                                    placeholder="Titre de la tâche"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all"
                                    placeholder="Détails de la tâche..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Priorité : <span className="font-semibold" style={{ color: getPrioritySliderColor(editFormData.priority) }}>{getPriorityLabel(editFormData.priority)}</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={editFormData.priority}
                                        onChange={(e) => setEditFormData({ ...editFormData, priority: parseInt(e.target.value) })}
                                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #22c55e 0%, #84cc16 25%, #eab308 50%, #f97316 75%, #ef4444 100%)`,
                                        }}
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">5</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 font-medium transition-colors"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
