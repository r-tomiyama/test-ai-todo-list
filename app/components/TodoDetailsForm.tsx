"use client";

import { TodoInputProps } from "../types/todo";

interface TodoDetailsFormProps extends TodoInputProps {
  description: string;
  setDescription: (description: string) => void;
  dueDate: string;
  setDueDate: (dueDate: string) => void;
}

const TodoDetailsForm = ({
  description,
  setDescription,
  dueDate,
  setDueDate,
  isCreating,
}: TodoDetailsFormProps) => {
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
          className="w-full border border-[#CCCCCC] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
          disabled={isCreating}
          rows={2}
        />
      </div>
      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm text-[#757575] mb-1"
        >
          期日
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-[#CCCCCC] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EC5AF]"
          disabled={isCreating}
        />
      </div>
    </div>
  );
};

export default TodoDetailsForm;
