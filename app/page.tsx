"use client";

import Image from "next/image";
import { useState } from "react";
import type { Todo } from "./__generated__/prisma";
import ProjectList from "./components/ProjectList";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import TodoModal from "./components/TodoModal";
import { useProjects } from "./hooks/useProjects";
import { useTodos } from "./hooks/useTodos";
import { Project } from "./types/todo";

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(undefined);

  const { projects, isLoading: isLoadingProjects } = useProjects();

  const {
    todos,
    isLoading,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    isCreating,
  } = useTodos(selectedProjectId);

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
    dueDate: string,
    projectId?: number
  ) => {
    // プロジェクト選択画面でタスクを追加する場合、そのプロジェクトに関連付ける
    const effectiveProjectId = projectId || selectedProjectId;
    await createTodo(title, description, dueDate, effectiveProjectId);
  };

  // プロジェクト選択処理
  const handleSelectProject = (projectId?: number) => {
    setSelectedProjectId(projectId);
  };

  // プロジェクト名を取得
  const getSelectedProjectName = () => {
    if (selectedProjectId === undefined) return "すべてのタスク";
    const project = projects.find((p) => p.id === selectedProjectId);
    return project ? project.name : "選択されたプロジェクト";
  };

  // 完了済みと未完了のTodoに分ける
  const incompleteTodos = todos?.filter((todo) => !todo.completed) || [];
  const completedTodos = todos?.filter((todo) => todo.completed) || [];

  return (
    <main className="py-12">
      <div className="todo-container relative min-h-[700px]">
        {/* 恐竜のイラスト（大きく表示） */}
        <div className="dinosaur-bg">
          <Image
            src="/dinosaur.png"
            alt="恐竜のイラスト"
            width={500}
            height={700}
            priority
          />
        </div>

        {/* タイトルを外側に移動して中央寄せ */}
        <h1 className="app-title text-3xl font-bold text-center mb-8">
          Todoリスト
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <ProjectList />
          </div>

          <div className="flex mb-6 items-center">
            <h2 className="text-2xl font-bold">{getSelectedProjectName()}</h2>
          </div>

          {!isLoadingProjects && projects.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSelectProject(undefined)}
                  className={`px-4 py-2 rounded-md ${
                    selectedProjectId === undefined
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  すべて
                </button>

                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project.id)}
                    className={`px-4 py-2 rounded-md ${
                      selectedProjectId === project.id
                        ? "bg-[var(--primary-color)] text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="todo-content">
            <TodoForm onAddTodo={handleAddTodo} isCreating={isCreating} />

            {isLoading ? (
              <div className="text-center py-4">
                <p>読み込み中...</p>
              </div>
            ) : (
              <div className="mt-4 h-[400px] overflow-y-auto pr-2">
                {/* 未完了のTODO */}
                {incompleteTodos.length > 0 ? (
                  <div className="space-y-2.5 mb-4">
                    {incompleteTodos.map((todo, index) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onTodoClick={handleTodoClick}
                        toggleTodo={toggleTodo}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <></>
                )}

                {/* 完了済みのTODO */}
                {completedTodos.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold mb-3 mt-8 text-gray-500">
                      完了したタスク
                    </h2>
                    <div className="space-y-2.5">
                      {completedTodos.map((todo, index) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onTodoClick={handleTodoClick}
                          toggleTodo={toggleTodo}
                          index={index}
                        />
                      ))}
                    </div>
                  </>
                )}

                {incompleteTodos.length === 0 &&
                  completedTodos.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <p>タスクがありません。新しいタスクを追加しましょう！</p>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* 選択されたTodoを編集するモーダル */}
          {selectedTodo && (
            <TodoModal
              todo={selectedTodo}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          )}
        </div>
      </div>
    </main>
  );
}
