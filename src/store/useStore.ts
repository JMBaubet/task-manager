import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Task, TaskStatus } from '../types';
import { ReactNode } from 'react';
import { supabase } from '../services/supabase';

interface AppState {
    projects: Project[];
    fetchProjects: () => Promise<void>;
    addProject: (name: string, description: string) => Promise<void>;
    updateProject: (id: string, name: string, description: string) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    addTask: (projectId: string, title: string, description: string, status: TaskStatus, priority?: number) => Promise<void>;
    updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (projectId: string, taskId: string) => Promise<void>;
    moveTask: (projectId: string, taskId: string, newStatus: TaskStatus, newIndex: number) => Promise<void>;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    accentColor: 'gray' | 'blue' | 'orange' | 'red' | 'green' | 'purple' | 'pink' | 'yellow' | 'cyan';
    setAccentColor: (color: 'gray' | 'blue' | 'orange' | 'red' | 'green' | 'purple' | 'pink' | 'yellow' | 'cyan') => void;
    pageTitle: ReactNode | null;
    setPageTitle: (title: ReactNode | null) => void;
    actionButton: ReactNode | null;
    setActionButton: (button: ReactNode | null) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            accentColor: 'gray',
            setAccentColor: (color) => set({ accentColor: color }),
            pageTitle: null,
            setPageTitle: (title) => set({ pageTitle: title }),
            actionButton: null,
            setActionButton: (button) => set({ actionButton: button }),
            projects: [],

            fetchProjects: async () => {
                try {
                    const { data: projectsData, error: projectsError } = await supabase
                        .from('projects')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (projectsError) throw projectsError;

                    const projectsWithTasks = await Promise.all(
                        (projectsData || []).map(async (project) => {
                            const { data: tasksData, error: tasksError } = await supabase
                                .from('tasks')
                                .select('*')
                                .eq('project_id', project.id)
                                .order('created_at', { ascending: true });

                            if (tasksError) throw tasksError;

                            return {
                                id: project.id,
                                name: project.name,
                                description: project.description || '',
                                tasks: (tasksData || []).map((task) => ({
                                    id: task.id,
                                    title: task.title,
                                    description: task.description || '',
                                    status: task.status as TaskStatus,
                                    priority: task.priority || 3,
                                    createdAt: new Date(task.created_at).getTime(),
                                })),
                                createdAt: new Date(project.created_at).getTime(),
                            };
                        })
                    );

                    set({ projects: projectsWithTasks });
                } catch (error) {
                    console.error('Failed to fetch from Supabase:', error);
                }
            },

            addProject: async (name, description) => {
                const { data, error } = await supabase
                    .from('projects')
                    .insert([{ name, description }])
                    .select()
                    .single();

                if (error) {
                    console.error('Failed to add project:', error);
                    return;
                }

                const newProject: Project = {
                    id: data.id,
                    name: data.name,
                    description: data.description || '',
                    tasks: [],
                    createdAt: new Date(data.created_at).getTime(),
                };

                set((state) => ({ projects: [...state.projects, newProject] }));
            },

            updateProject: async (id, name, description) => {
                const { error } = await supabase
                    .from('projects')
                    .update({ name, description })
                    .eq('id', id);

                if (error) {
                    console.error('Failed to update project:', error);
                    return;
                }

                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, name, description } : p
                    ),
                }));
            },

            deleteProject: async (id) => {
                const { error } = await supabase
                    .from('projects')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error('Failed to delete project:', error);
                    return;
                }

                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                }));
            },

            addTask: async (projectId, title, description, status, priority = 3) => {
                const { data, error } = await supabase
                    .from('tasks')
                    .insert([{ project_id: projectId, title, description, status, priority }])
                    .select()
                    .single();

                if (error) {
                    console.error('Failed to add task:', error);
                    return;
                }

                const newTask: Task = {
                    id: data.id,
                    title: data.title,
                    description: data.description || '',
                    status: data.status as TaskStatus,
                    priority: data.priority || 3,
                    createdAt: new Date(data.created_at).getTime(),
                };

                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? { ...p, tasks: [...p.tasks, newTask] }
                            : p
                    ),
                }));
            },

            updateTask: async (projectId, taskId, updates) => {
                const { error } = await supabase
                    .from('tasks')
                    .update(updates)
                    .eq('id', taskId);

                if (error) {
                    console.error('Failed to update task:', error);
                    return;
                }

                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                ...p,
                                tasks: p.tasks.map((t) =>
                                    t.id === taskId ? { ...t, ...updates } : t
                                ),
                            }
                            : p
                    ),
                }));
            },

            deleteTask: async (projectId, taskId) => {
                const { error } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', taskId);

                if (error) {
                    console.error('Failed to delete task:', error);
                    return;
                }

                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                ...p,
                                tasks: p.tasks.filter((t) => t.id !== taskId),
                            }
                            : p
                    ),
                }));
            },

            moveTask: async (projectId, taskId, newStatus, newIndex) => {
                set((state) => {
                    const project = state.projects.find((p) => p.id === projectId);
                    if (!project) return state;

                    const task = project.tasks.find((t) => t.id === taskId);
                    if (!task) return state;

                    const remainingTasks = project.tasks.filter((t) => t.id !== taskId);
                    const updatedTask = { ...task, status: newStatus };
                    const destinationTasks = remainingTasks.filter((t) => t.status === newStatus);

                    let newGlobalTasks = [...remainingTasks];

                    if (newIndex >= destinationTasks.length) {
                        newGlobalTasks.push(updatedTask);
                    } else {
                        const taskAtDestination = destinationTasks[newIndex];
                        const indexInGlobal = remainingTasks.findIndex((t) => t.id === taskAtDestination.id);
                        if (indexInGlobal !== -1) {
                            newGlobalTasks.splice(indexInGlobal, 0, updatedTask);
                        } else {
                            newGlobalTasks.push(updatedTask);
                        }
                    }

                    const newProjects = state.projects.map((p) =>
                        p.id === projectId
                            ? { ...p, tasks: newGlobalTasks }
                            : p
                    );

                    // Update in Supabase
                    supabase
                        .from('tasks')
                        .update({ status: newStatus })
                        .eq('id', taskId)
                        .then(({ error }) => {
                            if (error) console.error('Failed to update task status:', error);
                        });

                    return { projects: newProjects };
                });
            },
        }),
        {
            name: 'task-manager-storage-v2',
            partialize: (state) => ({
                theme: state.theme,
                accentColor: state.accentColor,
            }),
        }
    )
);
