import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

let toastCount = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastCount;
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem = ({ toast, onClose }) => {
  const icons = {
    info: <Info className="w-5 h-5 text-blue-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />
  };

  const bgColors = {
    info: 'bg-white dark:bg-slate-900 border-l-4 border-blue-500 dark:border-l-[#58a6ff]',
    success: 'bg-white dark:bg-slate-900 border-l-4 border-green-500 dark:border-l-[#3fb950]',
    warning: 'bg-white dark:bg-slate-900 border-l-4 border-yellow-500 dark:border-l-[#d29922]',
    error: 'bg-white dark:bg-slate-900 border-l-4 border-red-500 dark:border-l-[#f85149]'
  };

  return (
    <div className={`flex items-start gap-3 p-4 min-w-[300px] shadow-lg dark:shadow-none rounded-md border text-gray-800 dark:text-slate-200 dark:border-slate-800 animate-slide-up ${bgColors[toast.type || 'info']}`}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type || 'info']}
      </div>
      <div className="flex-1 text-sm font-medium">
        {toast.message}
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
