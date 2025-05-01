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
}: TodoItemProps) => (
  <button
    type="button"
    onClick={() => onTodoClick(todo)}
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

export default TodoItem;
