"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  startIcon,
  endIcon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  // 基本スタイル
  const baseStyle = "font-medium rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer";
  
  // サイズに基づくスタイル
  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-3 text-base",
  };
  
  // バリアントに基づくスタイル
  const variantStyles = {
    primary: "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color-hover)] hover:shadow-sm focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2",
    secondary: "border border-[#CCCCCC] text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
    danger: "bg-[var(--text-delete)] text-white hover:bg-opacity-80 hover:shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    text: "text-[var(--primary-color)] hover:bg-opacity-10 hover:bg-[var(--primary-color)] hover:text-[var(--primary-color-hover)] focus:outline-none",
  };

  // 幅のスタイル
  const widthStyle = fullWidth ? "w-full" : "";
  
  // 無効化されているときのスタイル
  const disabledStyle = disabled || isLoading ? "opacity-60 cursor-not-allowed" : "";
  
  // 最終的なスタイルクラス
  const buttonClass = `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${disabledStyle} ${className}`;

  return (
    <button 
      type="button" 
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export default Button;
