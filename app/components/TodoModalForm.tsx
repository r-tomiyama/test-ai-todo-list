"use client";

import { useState } from "react";
import type { Todo } from "../__generated__/prisma";
import Button from "./Button";

interface TodoModalFormProps {
  todo: Todo;
  isUpdating: boolean;
  isDeleting: boolean;
  onSubmit: (e: React.FormEvent, formData: {
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
  }) => void;
  onDelete: () => void;
  onCancel: () => void;
}

const TodoModalForm = ({
  todo,
  isUpdating,
  isDeleting,
  onSubmit,
  onDelete,
  onCancel,
}: TodoModalFormProps) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
  );
  const [completed, setCompleted] = useState(todo.completed);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, {
      title,
      description,
      dueDate,
      completed
    });
  };

  return (
    <form onSubmit={handleFormSubmit}>
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
        <Button
          onClick={onDelete}
          variant="danger"
          disabled={isDeleting}
          isLoading={isDeleting}
        >
          {isDeleting ? "削除中..." : "削除"}
        </Button>

        <div className="flex space-x-4">
          <Button
            onClick={onCancel}
            variant="secondary"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdating}
            isLoading={isUpdating}
          >
            {isUpdating ? "更新中..." : "保存"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TodoModalForm;
