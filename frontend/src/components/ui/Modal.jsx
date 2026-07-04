import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children, footer, destructive, onConfirm, confirmText = 'Confirm', isLoading }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className={`text-lg font-semibold ${destructive ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-200'}`}>{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 rounded" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 text-sm text-slate-600 dark:text-slate-400">
          {children}
        </div>
        {(footer || onConfirm) && (
          <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            {footer ? footer : (
              <>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button 
                  onClick={onConfirm} 
                  isLoading={isLoading} 
                  className={destructive ? 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-600' : ''}
                >
                  {confirmText}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
