"use client";

import { useState } from "react";
import TodoDetailsForm from "./TodoDetailsForm";
import Button from "./Button";
import { TodoFormData, TodoInputProps } from "../types/todo";

interface TodoFormProps extends TodoInputProps {
  onAddTodo: (
    title: string,
    description: string,
    dueDate: string
  ) => Promise<void>;
}

const TodoForm = ({ onAddTodo, isCreating }: TodoFormProps) => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: "",
    description: "",
    dueDate: ""
  });
  const [showDetails, setShowDetails] = useState(false);

  // 入力値の変更ハンドラー
  const handleChange = (field: keyof TodoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Todo追加の処理
  const handleAddTodo = async () => {
    if (!formData.title.trim()) return;
    
    await onAddTodo(
      formData.title.trim(), 
      formData.description, 
      formData.dueDate
    );
    
    // フォームをリセット
    setFormData({ title: "", description: "", dueDate: "" });
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
      <div className="flex gap-2">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを入力"
          className="border border-[#CCCCCC] rounded-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
          disabled={isCreating}
        />
        <Button 
          onClick={handleAddTodo}
          variant="primary"
          disabled={isCreating}
          isLoading={isCreating}
        >
          追加
        </Button>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="details-toggle w-full flex items-center justify-start text-green-500"
        >
          <span className="details-toggle-icon">{showDetails ? "▼" : "▼"}</span>
          {showDetails ? "詳細を閉じる" : "詳細を開く"}
        </button>

        {showDetails && (
          <TodoDetailsForm
            description={formData.description}
            setDescription={(value) => handleChange("description", value)}
            dueDate={formData.dueDate}
            setDueDate={(value) => handleChange("dueDate", value)}
            isCreating={isCreating}
          />
        )}
      </div>
    </div>
  );
};

export default TodoForm;
