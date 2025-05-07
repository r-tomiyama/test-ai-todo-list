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
      <div className="flex">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを入力"
          className="border border-[#e2f3ed] rounded-l-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-[#b5ead7]"
          disabled={isCreating}
        />
        <button
          type="button"
          onClick={handleAddTodo}
          className="btn-pastel px-6 py-3 rounded-r-lg font-medium"
          disabled={isCreating}
        >
          追加
        </button>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-[#6b8e7d] hover:underline flex items-center"
        >
          <span className="mr-1">{showDetails ? "▼" : "►"}</span>
          {showDetails ? "詳細を隠く" : "詳細を開く"}
        </button>

        {showDetails && (
          <div className="mt-3 space-y-3 p-3 bg-[#f0f7f4] rounded-lg">
            <div>
              <label
                htmlFor="description"
                className="block text-sm text-[#6b8e7d] mb-1 font-medium"
              >
                詳細
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="タスクの説明（任意）"
                className="w-full border border-[#e2f3ed] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b5ead7]"
                disabled={isCreating}
                rows={2}
              />
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm text-[#6b8e7d] mb-1 font-medium"
              >
                期日（任意）
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-[#e2f3ed] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b5ead7]"
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
