"use client";

import { useState } from "react";
import type { Todo } from "../__generated__/prisma";
import TodoModalForm from "./TodoModalForm";

interface TodoModalProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: number,
    updates: {
      title?: string;
      description?: string;
      dueDate?: Date;
      completed?: boolean;
      projectId?: number;
    }
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const TodoModal = ({
  todo,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: TodoModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    formData: {
      title: string;
      description: string;
      dueDate: string;
      completed: boolean;
      projectId?: number;
    }
  ) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, {
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        completed: formData.completed,
        projectId: formData.projectId,
      });
      onClose();
    } catch (error) {
      console.error("更新中にエラーが発生しました:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!confirm("このタスクを削除してもよろしいですか？")) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
      onClose();
    } catch (error) {
      console.error("削除中にエラーが発生しました:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-auto"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        pointerEvents: "auto",
      }}
      onClick={onClose}
    >
      <dialog
        open
        className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-lg m-0"
        style={{
          position: "relative",
          margin: "auto",
          inset: "0",
          transform: "none",
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        aria-labelledby="modal-title-heading"
      >
        <h2
          id="modal-title-heading"
          className="text-2xl font-bold mb-6 text-[#B08BE2]"
        >
          編集
        </h2>
        <TodoModalForm
          todo={todo}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onCancel={onClose}
        />
      </dialog>
    </div>
  );
};

export default TodoModal;
