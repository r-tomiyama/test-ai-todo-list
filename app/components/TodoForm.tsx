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
          className="border border-gray-300 rounded-l p-2 flex-grow"
          disabled={isCreating}
        />
        <button
          type="button"
          onClick={handleAddTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          disabled={isCreating}
        >
          追加
        </button>
      </div>

      <div className="mt-2">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-500 hover:underline"
        >
          {showDetails ? "詳細を隠す" : "詳細を追加 (任意)"}
        </button>

        {showDetails && (
          <div className="mt-2 space-y-2">
            <div>
              <label
                htmlFor="description"
                className="block text-sm text-gray-600 mb-1"
              >
                説明
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="タスクの説明（任意）"
                className="w-full border border-gray-300 rounded p-2 text-sm"
                disabled={isCreating}
                rows={2}
              />
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm text-gray-600 mb-1"
              >
                期日（任意）
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
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
