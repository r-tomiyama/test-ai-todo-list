"use client";

import { useState } from "react";
import type { Todo } from "./__generated__/prisma";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import TodoModal from "./components/TodoModal";
import { useTodos } from "./hooks/useTodos";

export default function Home() {
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

  // 新しいTodoの追加処理
  const handleAddTodo = async (
    title: string,
    description: string,
    dueDate: string
  ) => {
    await createTodo(title, description, dueDate);
  };

  // 完了済みと未完了のTodoに分ける
  const incompleteTodos = todos?.filter((todo) => !todo.completed) || [];
  const completedTodos = todos?.filter((todo) => todo.completed) || [];

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo リスト</h1>

      <TodoForm onAddTodo={handleAddTodo} isCreating={isCreating} />

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
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onTodoClick={handleTodoClick}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                  />
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
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onTodoClick={handleTodoClick}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                  />
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
