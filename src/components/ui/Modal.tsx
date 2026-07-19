import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ open, onClose, children, title, size = 'lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm animate-fade-in-fast"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${sizes[size]} max-h-[92vh] overflow-y-auto card-surface p-6 sm:p-8 animate-scale-in`}
      >
        <button
          onClick={onClose}
          aria-label="Închide"
          className="absolute right-4 top-4 rounded-full p-2 text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800 transition"
        >
          <X size={20} />
        </button>
        {title && <h3 className="mb-4 pr-8 text-2xl font-semibold">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
