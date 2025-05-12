"use client";

import { useState } from "react";

interface TodoFormProps {
  onAddTodo: (
    title: string,
    description: string,
    dueDate: string
  ) => Promise<void>;
  isCreating: boolean;
}

const TodoForm = ({ onAddTodo, isCreating }: TodoFormProps) => {
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  // Todo追加の処理
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    await onAddTodo(newTodo.trim(), description, dueDate);
    setNewTodo("");
    setDescription("");
    setDueDate("");
    setShowDetails(false);
  };

  // Enterキーでの送信
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを入力"
          className="border border-[#CCCCCC] rounded-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
          disabled={isCreating}
        />
        <button
          type="button"
          onClick={handleAddTodo}
          className="btn-pastel px-4 py-3 rounded-lg font-medium"
          disabled={isCreating}
        >
          追加
        </button>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="details-toggle w-full flex items-center justify-start text-green-500"
        >
          <span className="details-toggle-icon">{showDetails ? "▼" : "▼"}</span>
          {showDetails ? "詳細を閉じる" : "詳細を開く"}
        </button>

        {showDetails && (
          <div className="details-form">
            <div className="mb-3">
              <label
                htmlFor="description"
                className="block text-sm text-[#757575] mb-1"
              >
                詳細
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細"
                className="w-full border border-[#CCCCCC] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
                disabled={isCreating}
                rows={2}
              />
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm text-[#757575] mb-1"
              >
                期日
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-[#CCCCCC] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
                disabled={isCreating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoForm;
