import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Task, TaskStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ReactNode } from 'react';
import { jsonbin } from '../services/jsonbin';

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
    pageTitle: ReactNode | null;
    setPageTitle: (title: ReactNode | null) => void;
    actionButton: ReactNode | null;
    setActionButton: (button: ReactNode | null) => void;
}

// Helper to save state to JSONBin
const saveState = async (projects: Project[]) => {
    try {
        await jsonbin.update({ projects });
    } catch (error) {
        console.error('Failed to save to JSONBin:', error);
    }
};

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            pageTitle: null,
            setPageTitle: (title) => set({ pageTitle: title }),
            actionButton: null,
            setActionButton: (button) => set({ actionButton: button }),
            projects: [],

            fetchProjects: async () => {
                try {
                    const data = await jsonbin.get();
                    if (data && data.projects) {
                        set({ projects: data.projects });
                    }
                } catch (error) {
                    console.error('Failed to fetch from JSONBin:', error);
                }
            },

            addProject: async (name, description) => {
                const newProject: Project = {
                    id: uuidv4(),
                    name,
                    description,
                    tasks: [],
                    createdAt: Date.now(),
                };

                set((state) => {
                    const newProjects = [...state.projects, newProject];
                    saveState(newProjects);
                    return { projects: newProjects };
                });
            },

            updateProject: async (id, name, description) => {
                set((state) => {
                    const newProjects = state.projects.map((p) =>
                        p.id === id ? { ...p, name, description } : p
                    );
                    saveState(newProjects);
                    return { projects: newProjects };
                });
            },

            deleteProject: async (id) => {
                set((state) => {
                    const newProjects = state.projects.filter((p) => p.id !== id);
                    saveState(newProjects);
                    return { projects: newProjects };
                });
            },

            addTask: async (projectId, title, description, status, priority = 3) => {
                const newTask: Task = {
                    id: uuidv4(),
                    title,
                    description,
                    status,
                    priority,
                    createdAt: Date.now(),
                };

                set((state) => {
                    const newProjects = state.projects.map((p) =>
                        p.id === projectId
                            ? { ...p, tasks: [...p.tasks, newTask] }
                            : p
                    );
                    saveState(newProjects);
                    return { projects: newProjects };
                });
            },

            updateTask: async (projectId, taskId, updates) => {
                set((state) => {
                    const newProjects = state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                ...p,
                                tasks: p.tasks.map((t) =>
                                    t.id === taskId ? { ...t, ...updates } : t
                                ),
                            }
                            : p
                    );
                    saveState(newProjects);
                    return { projects: newProjects };
                });
            },

            deleteTask: async (projectId, taskId) => {
                set((state) => {
                    const newProjects = state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                ...p,
                                tasks: p.tasks.filter((t) => t.id !== taskId),
                            }
                            : p
                    );
                    saveState(newProjects);
                    return { projects: newProjects };
                });
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

                    saveState(newProjects);
                    return { projects: newProjects };
                });
            },
        }),
        {
            name: 'task-manager-storage-v2',
            partialize: (state) => ({
                theme: state.theme,
                // We don't persist projects to localStorage anymore to avoid conflicts
            }),
        }
    )
);


