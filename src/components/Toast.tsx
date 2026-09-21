"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const baseStyles = "fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-50 text-white";
  const typeStyles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      {type === "success" && <CheckCircle className="w-5 h-5" />}
      {type === "error" && <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-2 hover:opacity-80"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
