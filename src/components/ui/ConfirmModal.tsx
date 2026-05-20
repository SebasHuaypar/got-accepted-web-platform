"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isProcessing = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={isProcessing ? undefined : onCancel}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full p-6 animate-scaleUp flex flex-col items-center text-center">
        
        {/* Icon Header */}
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <FiAlertTriangle size={28} />
        </div>
        
        {/* Text */}
        <h3 className="text-xl font-black text-primary mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 font-medium mb-8">
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-widest disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-lg transition-all uppercase tracking-widest disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
