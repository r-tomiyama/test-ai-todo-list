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
  onDelete: (id: number) => Promise<void>; // 削除機能を追加
}

const TodoModal = ({
  todo,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: TodoModalProps) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
  );
  const [completed, setCompleted] = useState(todo.completed);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // 削除処理を追加
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
              className="w-full border border-[#CCCCCC] rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
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
              className="w-full border border-[#CCCCCC] rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
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
              className="w-full border border-[#CCCCCC] rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
            />
          </div>

          {/* 区切り線を追加 */}
          <hr className="my-4 border-t border-[#EEEEEE]" />

          <div className="mb-12">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={completed}
                onChange={() => setCompleted(!completed)}
                className="custom-checkbox mr-3 cursor-pointer"
              />
              <span className="text-base text-gray-700">完了</span>
            </label>
          </div>
          <div className="flex justify-between items-center">
            {/* 削除ボタンを追加 */}
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 text-white rounded-lg hover:bg-opacity-80 text-base"
              style={{ backgroundColor: "var(--text-delete)" }}
              disabled={isDeleting}
            >
              {isDeleting ? "削除中..." : "削除"}
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-[#CCCCCC] rounded-lg text-gray-700 hover:bg-gray-100 text-base"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#4EC5AF] text-white rounded-lg hover:bg-[#43b6a0] text-base"
                disabled={isUpdating}
              >
                {isUpdating ? "更新中..." : "保存"}
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default TodoModal;
