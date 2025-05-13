// filepath: /Users/peko/git-repo/test-ai-todo-list/app/components/ProjectForm.tsx
"use client";

import { useState } from "react";
import type { ProjectFormData } from "../types/todo";

interface ProjectFormProps {
  defaultValues?: {
    name: string;
    description: string;
  };
  onSubmit: (data: ProjectFormData) => void;
  onCancel?: () => void;
}

export default function ProjectForm({
  defaultValues,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: defaultValues?.name || "",
    description: defaultValues?.description || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // 編集モードでなければフォームをリセット
    if (!defaultValues) {
      setFormData({ name: "", description: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          プロジェクト名 *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          説明
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {defaultValues ? "更新" : "作成"}
        </button>
      </div>
    </form>
  );
}
