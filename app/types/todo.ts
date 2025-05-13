export interface TodoFormData {
  title: string;
  description: string;
  dueDate: string;
}

export interface TodoInputProps {
  isCreating: boolean;
}

export interface TodoUpdateData {
  title?: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
}

export interface TodoModalFormData {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}
