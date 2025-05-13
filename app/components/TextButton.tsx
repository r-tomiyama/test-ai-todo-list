"use client";

import type React from "react";

interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: "primary" | "delete";
  className?: string;
}

const TextButton: React.FC<TextButtonProps> = ({
  children,
  color = "primary",
  className = "",
  ...props
}) => {
  const colorStyles = {
    primary: "text-[var(--text-edit)]",
    delete: "text-[var(--text-delete)]",
  };

  return (
    <button
      type="button"
      className={`font-medium text-sm inline-flex items-center justify-center transition-colors cursor-pointer focus:outline-none hover:bg-opacity-10 ${colorStyles[color]} px-0 py-0 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TextButton;
