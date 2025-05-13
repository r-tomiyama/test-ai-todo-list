export interface TodoFormData {
  title: string;
  description: string;
  dueDate: string;
  projectId?: number;
}

export interface TodoInputProps {
  isCreating: boolean;
}

export interface TodoUpdateData {
  title?: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
  projectId?: number;
}

export interface TodoModalFormData {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  projectId?: number;
}

export interface ProjectFormData {
  name: string;
  description: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithTodos extends Project {
  todos: Todo[];
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  projectId?: number;
  project?: Project;
}
