export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    tasks: Task[];
    createdAt: number;
}

export interface DragItem {
    id: string;
    type: 'TASK';
    index: number;
}
