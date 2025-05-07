"use client";

import type { Todo } from "../__generated__/prisma";

interface TodoItemProps {
  todo: Todo;
  onTodoClick: (todo: Todo) => void;
  toggleTodo: (id: number) => void;
  index?: number;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '/');
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

  return (
    <div 
      className="todo-card mb-2.5 overflow-hidden cursor-pointer rounded-lg bg-white shadow-sm"
      onClick={() => onTodoClick(todo)}
    >
      <div className="flex items-center">
        {/* 左側のカラーマーカー */}
        <div 
          className="w-8 h-8 rounded-full flex-shrink-0 mx-3" 
          style={{ backgroundColor: todoColor.bgColor }}
        />
        
        <div className="flex-grow flex items-center justify-between p-3">
          <div className="flex-grow pr-2">
            <h3
              className={`font-bold text-base ${
                todo.completed ? "line-through text-gray-500" : todoColor.textColor
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
    </div>
  );
};

export default TodoItem;
