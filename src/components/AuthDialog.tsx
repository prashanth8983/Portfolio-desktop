import React, { useState, useEffect, useRef } from 'react';
import { FaLock } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, email: string) => void;
  title?: string;
  message?: string;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Authentication Required',
  message = 'Enter your name and email to leave feedback.',
}) => {
  const { isDark } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFirstName('');
      setEmail('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Name is required');
      triggerShake();
      return;
    }

    if (!trimmedEmail) {
      setError('Email is required');
      triggerShake();
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email');
      triggerShake();
      return;
    }

    onSubmit(trimmedName, trimmedEmail);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`
          w-[320px] rounded-xl shadow-2xl overflow-hidden
          ${isDark ? 'bg-[#2d2d2d]' : 'bg-[#ececec]'}
          ${isShaking ? 'animate-shake' : ''}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with icon */}
        <div className="flex flex-col items-center pt-6 pb-4 px-6">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-4
            ${isDark ? 'bg-[#3d3d3d]' : 'bg-white'}
            shadow-inner
          `}>
            <FaLock className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          <p className={`text-sm text-center mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {message}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-3">
            <input
              ref={firstInputRef}
              type="text"
              placeholder="Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`
                w-full px-3 py-2 rounded-md text-sm
                outline-none transition-all
                ${isDark
                  ? 'bg-[#1e1e1e] text-white border border-[#4d4d4d] focus:border-blue-500 placeholder-gray-500'
                  : 'bg-white text-gray-900 border border-gray-300 focus:border-blue-500 placeholder-gray-400'
                }
              `}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
                w-full px-3 py-2 rounded-md text-sm
                outline-none transition-all
                ${isDark
                  ? 'bg-[#1e1e1e] text-white border border-[#4d4d4d] focus:border-blue-500 placeholder-gray-500'
                  : 'bg-white text-gray-900 border border-gray-300 focus:border-blue-500 placeholder-gray-400'
                }
              `}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className={`
                flex-1 py-2 rounded-md text-sm font-medium transition-colors
                ${isDark
                  ? 'bg-[#4d4d4d] text-white hover:bg-[#5d5d5d]'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default AuthDialog;
