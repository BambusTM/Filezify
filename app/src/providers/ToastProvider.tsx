'use client';

import { Toaster, toast } from 'react-hot-toast';
import { createContext, useContext, ReactNode } from 'react';

type ToastContextType = {
  showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const showError = (message: string) => {
    toast.error(message, {
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#ff4b4b',
        secondary: '#fff',
      },
    });
  };

  return (
    <ToastContext.Provider value={{ showError }}>
      {children}
      <Toaster position="top-right" />
    </ToastContext.Provider>
  );
} 