"use client";

import { useProjects } from "../hooks/useProjects";
import type { TodoInputProps } from "../types/todo";

interface TodoDetailsFormProps extends TodoInputProps {
  description: string;
  setDescription: (description: string) => void;
  dueDate: string | undefined;
  setDueDate: (dueDate: string) => void;
  projectId?: number;
  setProjectId?: (projectId: number | undefined) => void;
}

const TodoDetailsForm = ({
  description,
  setDescription,
  dueDate,
  setDueDate,
  projectId,
  setProjectId,
  isCreating,
}: TodoDetailsFormProps) => {
  const { projects } = useProjects();

  return (
    <div className="details-form">
      <div className="mb-3">
        <label
          htmlFor="description"
          className="block text-sm text-[#757575] mb-1"
        >
          詳細
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="詳細"
          className="w-full border border-[#CCCCCC] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          disabled={isCreating}
          rows={2}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="dueDate" className="block text-sm text-[#757575] mb-1">
          期日
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-[#CCCCCC] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          disabled={isCreating}
        />
      </div>
      {setProjectId && (
        <div>
          <label
            htmlFor="project"
            className="block text-sm text-[#757575] mb-1"
          >
            プロジェクト
          </label>
          <select
            id="project"
            value={projectId || ""}
            onChange={(e) => {
              const value = e.target.value
                ? Number.parseInt(e.target.value)
                : undefined;
              setProjectId(value);
            }}
            className="w-full border border-[#CCCCCC] rounded-lg p-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            disabled={isCreating}
          >
            <option value="">未分類</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TodoDetailsForm;
