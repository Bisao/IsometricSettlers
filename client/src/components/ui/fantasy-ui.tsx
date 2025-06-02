
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from './button';

interface FantasyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function FantasyButton({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: FantasyButtonProps) {
  const baseClasses = "relative font-bold text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 border-2 rounded-lg overflow-hidden";
  
  const variantClasses = {
    primary: "bg-gradient-to-b from-amber-400 to-amber-600 border-amber-700 hover:from-amber-300 hover:to-amber-500 text-amber-900",
    secondary: "bg-gradient-to-b from-slate-400 to-slate-600 border-slate-700 hover:from-slate-300 hover:to-slate-500 text-slate-900",
    danger: "bg-gradient-to-b from-red-500 to-red-700 border-red-800 hover:from-red-400 hover:to-red-600 text-white",
    success: "bg-gradient-to-b from-green-500 to-green-700 border-green-800 hover:from-green-400 hover:to-green-600 text-white"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

interface FantasyPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClose?: () => void;
}

export function FantasyPanel({ children, title, className, onClose }: FantasyPanelProps) {
  return (
    <div className={cn(
      "bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-amber-600 rounded-xl shadow-2xl relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"%3E%3Cpath d=\"M0 0h100v100H0z\" fill=\"%23f59e0b\" fill-opacity=\"0.05\"/%3E%3Cpath d=\"M10 10h80v80H10z\" fill=\"none\" stroke=\"%23d97706\" stroke-width=\"0.5\" stroke-opacity=\"0.3\"/%3E%3C/svg%3E')] before:opacity-30",
      className
    )}>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-700 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-700 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-700 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-700 rounded-br-lg"></div>
      
      {title && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3 border-b-2 border-amber-800 relative">
          <h2 className="text-white font-bold text-lg text-center drop-shadow-lg">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-200 text-xl font-bold"
            >
              ✕
            </button>
          )}
        </div>
      )}
      
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );
}

interface FantasyModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function FantasyModal({ children, isOpen, onClose, title }: FantasyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <FantasyPanel title={title} onClose={onClose}>
          {children}
        </FantasyPanel>
      </div>
    </div>
  );
}
