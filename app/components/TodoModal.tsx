"use client";

import { useState } from "react";
import type { Todo } from "../__generated__/prisma";

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
    }
  ) => Promise<void>;
}

const TodoModal = ({ todo, isOpen, onClose, onUpdate }: TodoModalProps) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
  );
  const [completed, setCompleted] = useState(todo.completed);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, {
        title,
        description: description || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        completed,
      });
      onClose();
    } catch (error) {
      console.error("更新中にエラーが発生しました:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="bg-white rounded-lg w-full max-w-xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">TODOを編集</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="modal-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              タイトル
            </label>
            <input
              id="modal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-base"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="modal-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              説明（任意）
            </label>
            <textarea
              id="modal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-base"
              rows={4}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="modal-dueDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              期日（任意）
            </label>
            <input
              id="modal-dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-base"
            />
          </div>
          <div className="mb-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={completed}
                onChange={() => setCompleted(!completed)}
                className="h-5 w-5 mr-3 cursor-pointer"
              />
              <span className="text-base text-gray-700">完了</span>
            </label>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-base"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-base"
              disabled={isUpdating}
            >
              {isUpdating ? "更新中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;
