"use client";

import { useState } from "react";
import type { Todo } from "./__generated__/prisma";
import { useTodos } from "./hooks/useTodos";

// モーダルコンポーネント
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

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  // Todoをクリックしたときの処理
  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  // 完了済みと未完了のTodoに分ける
  const incompleteTodos = todos?.filter((todo) => !todo.completed) || [];
  const completedTodos = todos?.filter((todo) => todo.completed) || [];

  // Todoアイテムコンポーネント
  const TodoItem = ({ todo }: { todo: Todo }) => (
    <button
      type="button"
      key={todo.id}
      onClick={() => handleTodoClick(todo)}
      aria-label={`${todo.title} - ${todo.completed ? "完了" : "未完了"}のタスク`}
      className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow w-full text-left ${
        todo.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="flex items-center mb-2">
        <div>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => {
              e.stopPropagation(); // クリックイベントの伝播を止める
              toggleTodo(todo.id);
            }}
            className="mr-3 h-5 w-5"
            aria-checked={todo.completed}
          />
        </div>
        <h3
          className={`font-medium text-lg flex-grow ${
            todo.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.title}
        </h3>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // クリックイベントの伝播を止める
            deleteTodo(todo.id);
          }}
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>

      {todo.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {todo.description}
        </p>
      )}

      {todo.dueDate && (
        <div className="text-xs text-gray-500 mt-2 flex items-center">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>期日</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formatDate(todo.dueDate)}
        </div>
      )}
    </button>
  );

  return (
    <main className="max-w-6xl mx-auto p-4">
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

      {isLoading ? (
        <div className="text-center py-4">
          <p>読み込み中...</p>
        </div>
      ) : incompleteTodos.length > 0 || completedTodos.length > 0 ? (
        <>
          {/* 未完了のTODO */}
          {incompleteTodos.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-3 mt-6">
                未完了のタスク
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {incompleteTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </>
          )}

          {/* 完了済みのTODO */}
          {completedTodos.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-3 mt-6">
                完了したタスク
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {completedTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>タスクがありません。新しいタスクを追加しましょう！</p>
        </div>
      )}

      {/* 選択されたTodoを編集するモーダル */}
      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={updateTodo}
        />
      )}
    </main>
  );
}
