"use client";

import type { Todo } from "../__generated__/prisma";

interface TodoItemProps {
  todo: Todo;
  onTodoClick: (todo: Todo) => void;
  toggleTodo: (id: number) => void;
  index?: number;
}

const formatDate = (date: Date) => {
  return date
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "/");
};

const TodoItem = ({
  todo,
  onTodoClick,
  toggleTodo,
  index = 0,
}: TodoItemProps) => {
  // インデックスに基づいて交互にカラーを設定
  const colorOptions = [
    { bgColor: "#5FD6C6", textColor: "text-black" }, // teal
    { bgColor: "#B08BE2", textColor: "text-black" }, // purple
  ];

  // インデックスの偶数/奇数で色を交互に変更
  const colorIndex = index % 2;
  const todoColor = colorOptions[colorIndex];

  // チェックボックスのクリックを処理する関数
  const handleCheckboxClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // 親要素へのクリックイベントの伝播を防止
    toggleTodo(todo.id);
  };

  // キーボードイベントのハンドラー
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTodoClick(todo);
    }
  };

  return (
    <button
      type="button"
      className="todo-card mb-2.5 overflow-hidden cursor-pointer rounded-lg bg-white shadow-sm w-full text-left"
      onClick={() => onTodoClick(todo)}
      onKeyDown={handleKeyDown}
      aria-label={`${todo.title} を編集`}
    >
      <div className="flex items-center">
        {/* チェックボックス */}
        <div className="flex-shrink-0 mx-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => {
              e.stopPropagation();
              toggleTodo(todo.id);
            }}
            className="sr-only" // スクリーンリーダー用に実際のチェックボックスを含むが非表示にする
            id={`todo-checkbox-${todo.id}`}
            aria-checked={todo.completed}
          />
          <label
            htmlFor={`todo-checkbox-${todo.id}`}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative transition-all duration-200 hover:shadow-md hover:scale-110"
            style={{ backgroundColor: todoColor?.bgColor }}
            title={todo.completed ? "タスクを未完了に戻す" : "タスクを完了する"}
            onClick={(e) => {
              e.preventDefault(); // デフォルトの動作を防止
              e.stopPropagation(); // 親要素へのイベント伝播を防止
              toggleTodo(todo.id); // 直接ここでtoggleTodoを呼び出す
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                toggleTodo(todo.id);
              }
            }}
            tabIndex={0} // キーボードフォーカス可能にする
          >
            {todo.completed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6"
                strokeWidth="3"
                stroke="white"
                aria-hidden="true"
              >
                <title>完了マーク</title>
                <path
                  d="M6 12l4 4L18 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
            {!todo.completed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 opacity-0 hover:opacity-70 transition-opacity duration-200"
                strokeWidth="3"
                stroke="white"
                aria-hidden="true"
              >
                <title>未完了マーク</title>
                <path
                  d="M6 12l4 4L18 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
          </label>
        </div>

        <div className="flex-grow flex items-center justify-between p-3">
          <div className="flex-grow pr-2">
            <h3
              className={`font-bold text-base ${
                todo.completed
                  ? "line-through text-gray-500"
                  : todoColor?.textColor
              }`}
            >
              {todo.title}
            </h3>

            {todo.description && (
              <p className="text-sm text-gray-500 line-clamp-1">
                {todo.description}
              </p>
            )}
          </div>

          <div className="flex items-center">
            {todo.dueDate && (
              <span className="text-xs text-gray-500">
                {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default TodoItem;
