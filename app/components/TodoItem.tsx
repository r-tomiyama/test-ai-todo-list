"use client";

import type { Todo } from "../__generated__/prisma";

interface TodoItemProps {
  todo: Todo;
  onTodoClick: (todo: Todo) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

const TodoItem = ({
  todo,
  onTodoClick,
  toggleTodo,
  deleteTodo,
}: TodoItemProps) => {
  // カラーマッピング - Todoごとに異なるパステルカラーを割り当てる
  const colorOptions = [
    { bg: "bg-[#e2f3ed]", border: "border-[#b5ead7]" }, // ミント
    { bg: "bg-[#f8e1e7]", border: "border-[#ffb7c5]" }, // ピンク
    { bg: "bg-[#fdfde8]", border: "border-[#fdffb6]" }, // イエロー
    { bg: "bg-[#e8ebf7]", border: "border-[#c7ceea]" }, // ラベンダー
    { bg: "bg-[#fff2e6]", border: "border-[#ffd8b1]" }, // ピーチ
  ];
  
  // Todoのidを使用して一貫したカラーを選択
  const colorIndex = todo.id % colorOptions.length;
  const colorClasses = colorOptions[colorIndex];

  return (
    <button
      type="button"
      onClick={() => onTodoClick(todo)}
      aria-label={`${todo.title} - ${todo.completed ? "完了" : "未完了"}のタスク`}
      className={`todo-card p-4 cursor-pointer w-full text-left ${
        todo.completed ? "completed opacity-70" : `${colorClasses.bg} border-l-4 ${colorClasses.border}`
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
            className="custom-checkbox mr-3"
            aria-checked={todo.completed}
          />
        </div>
        <h3
          className={`font-medium text-lg flex-grow ${
            todo.completed ? "line-through text-gray-500" : "text-[#4a4a4a]"
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
          className="text-[#6b8e7d] hover:text-red-500 transition-colors ml-2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-[#fff2]"
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
};

export default TodoItem;
