"use client";

import { useState } from "react";
import { useTodos } from "./hooks/useTodos";

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const {
    todos,
    isLoading,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    isCreating,
  } = useTodos();

  // Todo追加の処理
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    await createTodo(newTodo.trim(), description, dueDate);
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

  // 日付をフォーマットする関数
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">tRPC Todo リスト</h1>

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
            {showDetails ? '詳細を隠す' : '詳細を追加 (任意)'}
          </button>
          
          {showDetails && (
            <div className="mt-2 space-y-2">
              <div>
                <label htmlFor="description" className="block text-sm text-gray-600 mb-1">説明</label>
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
                <label htmlFor="dueDate" className="block text-sm text-gray-600 mb-1">期日（任意）</label>
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

      {isLoading ? (
        <div className="text-center py-4">
          <p>読み込み中...</p>
        </div>
      ) : todos && todos.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {todos.map((todo) => (
            <li key={todo.id} className="py-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-3 h-5 w-5"
                />
                <span
                  className={`flex-grow ${todo.completed ? "line-through text-gray-500" : ""}`}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </div>
              
              {/* 詳細情報の表示 */}
              {(todo.description || todo.dueDate) && (
                <div className="ml-8 mt-1 text-sm text-gray-600">
                  {todo.description && (
                    <p className="mb-1">{todo.description}</p>
                  )}
                  {todo.dueDate && (
                    <p className="text-xs">期日: {formatDate(todo.dueDate as string)}</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>タスクがありません。新しいタスクを追加しましょう！</p>
        </div>
      )}
    </main>
  );
}
