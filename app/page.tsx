"use client";

import { useState } from "react";
import { useTodos } from "./hooks/useTodos";

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
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
    await createTodo(newTodo.trim());
    setNewTodo("");
  };

  // Enterキーでの送信
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">tRPC Todo リスト</h1>

      <div className="mb-6 flex">
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

      {isLoading ? (
        <div className="text-center py-4">
          <p>読み込み中...</p>
        </div>
      ) : todos && todos.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center py-3">
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
