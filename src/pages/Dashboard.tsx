import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Folder, Calendar, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Project } from '../types';
import { useLayoutContext } from '../components/Layout';

export default function Dashboard() {
    const { projects, addProject, deleteProject, updateProject } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);
    const { setPageTitle, setActionButton } = useLayoutContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProject) {
            updateProject(editingProject.id, formData.name, formData.description);
        } else {
            addProject(formData.name, formData.description);
        }
        closeModal();
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData({ name: project.name, description: project.description });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
        setFormData({ name: '', description: '' });
    };

    // Configure header with title and action button
    useEffect(() => {
        setPageTitle(
            <span className="text-gray-500 dark:text-gray-300 font-medium">
                Gérez vos projets en cours
            </span>
        );
        setActionButton(
            <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/40 transition-all shadow-sm"
            >
                <Plus className="w-5 h-5" />
                Nouveau Projet
            </button>
        );

        // Cleanup on unmount
        return () => {
            setPageTitle(null);
            setActionButton(null);
        };
    }, [setPageTitle, setActionButton]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-blue-500/20 transition-all group neon-card-hover relative">
                        <Link to={`/project/${project.id}`} className="block p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <Folder className="w-6 h-6" />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setOpenDropdownId(openDropdownId === project.id ? null : project.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-opacity"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                    {openDropdownId === project.id && (
                                        <div
                                            className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-lg rounded-lg p-1 z-10 min-w-[120px]"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                    openEditModal(project);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded flex items-center gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" /> Éditer
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                    setDeleteConfirmProject(project);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" /> Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 h-10">{project.description}</p>

                            <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-slate-700">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-medium">
                                    {project.tasks.length} tâches
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-600">
                        <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                            <Folder className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucun projet pour le moment</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Créez votre premier projet pour commencer</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Créer un Projet
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl dark:shadow-blue-900/20 w-full max-w-md overflow-hidden border dark:border-slate-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Projet</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="ex: Refonte Site Web"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Brève description du projet..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 font-medium transition-colors"
                                >
                                    {editingProject ? 'Enregistrer' : 'Créer le Projet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmProject && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl dark:shadow-blue-900/20 w-full max-w-md overflow-hidden border dark:border-slate-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirmer la suppression</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 dark:text-gray-300">
                                Êtes-vous sûr de vouloir supprimer le projet <span className="font-semibold">"{deleteConfirmProject.name}"</span> ?
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                Cette action est irréversible et supprimera également toutes les tâches associées.
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirmProject(null)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    deleteProject(deleteConfirmProject.id);
                                    setDeleteConfirmProject(null);
                                }}
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
