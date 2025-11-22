import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useStore } from '../store/useStore';
import { ArrowLeft, Plus } from 'lucide-react';
import Column from '../components/Column';
import { TaskStatus } from '../types';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const { projects, moveTask, addTask, deleteTask } = useStore();
    const project = projects.find(p => p.id === id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);

    if (!project) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Projet introuvable</h2>
                <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 block">Retour au Tableau de Bord</Link>
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
        setFormData({ title: '', description: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            addTask(id, formData.title, formData.description, newTaskStatus);
            setIsModalOpen(false);
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
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center gap-4 shrink-0 transition-colors">
                <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white neon-text-blue">{project.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-x-auto bg-gray-50 dark:bg-slate-900 transition-colors">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full min-w-fit">
                        <Column
                            title="À Faire"
                            status="todo"
                            tasks={tasksByStatus.todo}
                            onAddTask={handleAddTask}
                            onDeleteTask={handleDeleteTask}
                        />
                        <Column
                            title="En Cours"
                            status="in-progress"
                            tasks={tasksByStatus['in-progress']}
                            onAddTask={handleAddTask}
                            onDeleteTask={handleDeleteTask}
                        />
                        <Column
                            title="Terminé"
                            status="done"
                            tasks={tasksByStatus.done}
                            onAddTask={handleAddTask}
                            onDeleteTask={handleDeleteTask}
                        />
                    </div>
                </DragDropContext>
            </div>

            {/* Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl dark:shadow-blue-900/20 w-full max-w-md overflow-hidden border dark:border-slate-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Détails de la tâche..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 font-medium transition-colors"
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
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl dark:shadow-blue-900/20 w-full max-w-md overflow-hidden border dark:border-slate-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
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
                        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirmTaskId(null)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
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
        </div>
    );
}
