import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Task, TaskStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
    projects: Project[];
    addProject: (name: string, description: string) => void;
    updateProject: (id: string, name: string, description: string) => void;
    deleteProject: (id: string) => void;
    addTask: (projectId: string, title: string, description: string, status: TaskStatus, priority?: number) => void;
    updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
    deleteTask: (projectId: string, taskId: string) => void;
    moveTask: (projectId: string, taskId: string, newStatus: TaskStatus, newIndex: number) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'dark', // Default to dark for the neon vibe
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            projects: [],
            addProject: (name, description) =>
                set((state) => ({
                    projects: [
                        ...state.projects,
                        {
                            id: uuidv4(),
                            name,
                            description,
                            tasks: [],
                            createdAt: Date.now(),
                        },
                    ],
                })),
            updateProject: (id, name, description) =>
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, name, description } : p
                    ),
                })),
            deleteProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                })),
            addTask: (projectId, title, description, status, priority = 3) =>
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                ...p,
                                tasks: [
                                    ...p.tasks,
                                    {
                                        id: uuidv4(),
                                        title,
                                        description,
                                        status,
                                        priority,
                                        createdAt: Date.now(),
                                    },
                                ],
                            }
                            : p
                    ),
                })),
            updateTask: (projectId, taskId, updates) =>
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
                })),
            deleteTask: (projectId, taskId) =>
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                ...p,
                                tasks: p.tasks.filter((t) => t.id !== taskId),
                            }
                            : p
                    ),
                })),
            moveTask: (projectId, taskId, newStatus, newIndex) =>
                set((state) => {
                    const project = state.projects.find((p) => p.id === projectId);
                    if (!project) return state;

                    const task = project.tasks.find((t) => t.id === taskId);
                    if (!task) return state;

                    // Create a new array without the task being moved
                    const remainingTasks = project.tasks.filter((t) => t.id !== taskId);

                    // Update the task's status
                    const updatedTask = { ...task, status: newStatus };

                    // Get tasks in the destination column (from the remaining tasks)
                    const destinationTasks = remainingTasks.filter((t) => t.status === newStatus);

                    let newGlobalTasks = [...remainingTasks];

                    if (newIndex >= destinationTasks.length) {
                        // Append to the end of the global list (or we could try to keep it grouped, but appending is simplest and works for Kanban)
                        // To be more precise: if we want it to be the last of its status, putting it at the very end of the array works.
                        newGlobalTasks.push(updatedTask);
                    } else {
                        // Insert before the task that is currently at newIndex in the destination column
                        const taskAtDestination = destinationTasks[newIndex];
                        const indexInGlobal = remainingTasks.findIndex((t) => t.id === taskAtDestination.id);

                        if (indexInGlobal !== -1) {
                            newGlobalTasks.splice(indexInGlobal, 0, updatedTask);
                        } else {
                            // Fallback (should not happen)
                            newGlobalTasks.push(updatedTask);
                        }
                    }

                    return {
                        projects: state.projects.map((p) =>
                            p.id === projectId
                                ? { ...p, tasks: newGlobalTasks }
                                : p
                        ),
                    };
                }),
        }),
        {
            name: 'task-manager-storage',
        }
    )
);
