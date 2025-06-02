
import React from "react";
import { X } from "lucide-react";

interface FantasyPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClose?: () => void;
}

export function FantasyPanel({ children, title, className = "", onClose }: FantasyPanelProps) {
  return (
    <div className={`
      bg-gradient-to-br from-gray-50 via-white to-gray-100 
      border-2 border-gray-300 
      rounded-2xl 
      shadow-2xl 
      overflow-hidden
      backdrop-blur-md
      ${className}
    `}>
      {title && (
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 relative">
          <h2 className="text-lg font-bold text-center pr-8">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-white hover:text-gray-200 
                       transition-colors duration-200
                       p-1 rounded-full hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

interface FantasyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function FantasyButton({ 
  variant = "primary", 
  size = "md", 
  className = "", 
  children, 
  disabled,
  ...props 
}: FantasyButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-200
    transform hover:scale-105 active:scale-95
    shadow-lg hover:shadow-xl
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus:ring-4 focus:ring-opacity-50
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-slate-500 to-slate-600 
      hover:from-slate-600 hover:to-slate-700
      text-white border-2 border-slate-400
      focus:ring-slate-500
    `,
    secondary: `
      bg-gradient-to-r from-gray-200 to-gray-300 
      hover:from-gray-300 hover:to-gray-400
      text-gray-800 border-2 border-gray-400
      focus:ring-gray-500
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-emerald-600 
      hover:from-emerald-600 hover:to-emerald-700
      text-white border-2 border-emerald-400
      focus:ring-emerald-500
    `,
    danger: `
      bg-gradient-to-r from-rose-500 to-rose-600 
      hover:from-rose-600 hover:to-rose-700
      text-white border-2 border-rose-400
      focus:ring-rose-500
    `
  };

  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-3 text-base min-h-[44px]",
    lg: "px-6 py-4 text-lg min-h-[52px]"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
