
import React, { useEffect, useState } from 'react';
import { XIcon } from './icons/XIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 300);
  };
  
  const typeClasses = {
    success: 'bg-green-600/90 border-green-500',
    error: 'bg-red-600/90 border-red-500',
  };

  const Icon = type === 'success' ? CheckCircleIcon : XIcon;

  const animationClasses = exiting 
    ? 'opacity-0 translate-y-[-20px]' 
    : 'opacity-100 translate-y-0';

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[10000] flex items-center p-4 mb-4 w-full max-w-xs text-white rounded-lg shadow-2xl border backdrop-blur-sm transition-all duration-300 ease-in-out transform ${typeClasses[type]} ${animationClasses}`}
      role="alert"
    >
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${type === 'success' ? 'bg-green-800' : 'bg-red-800'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white/10 text-gray-200 hover:text-white hover:bg-white/20 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 transition-colors"
        onClick={handleClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
