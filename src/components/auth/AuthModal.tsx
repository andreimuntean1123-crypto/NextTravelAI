import { useEffect, useRef, useState } from 'react';
import { LogIn, Mail, User as UserIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { isGoogleConfigured, renderGoogleButton } from '@/lib/auth';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: Props) {
  const { signIn } = useApp();
  const googleRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!open || !isGoogleConfigured() || !googleRef.current) return;
    let active = true;
    renderGoogleButton(googleRef.current, (u) => {
      if (!active) return;
      signIn(u);
      onClose();
    }).catch(() => setError('Nu s-a putut încărca autentificarea Google.'));
    return () => {
      active = false;
    };
  }, [open, signIn, onClose]);

  const demoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signIn({ name: name.trim(), email: email.trim(), provider: 'demo', since: Date.now() });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="text-center">
        <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-turquoise-400 to-navy-700 text-white">
          <LogIn size={22} />
        </span>
        <h2 className="text-xl font-bold">Bine ai venit!</h2>
        <p className="mt-1 text-sm text-navy-500 dark:text-sand-200/70">
          Conectează-te ca să îți salvezi favoritele și itinerarele.
        </p>
      </div>

      {/* Google */}
      {isGoogleConfigured() && (
        <div className="mt-5 flex min-h-[44px] justify-center">
          <div ref={googleRef} />
        </div>
      )}
      {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}

      {/* Separator */}
      <div className="my-4 flex items-center gap-3 text-xs text-navy-400">
        <span className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
        {isGoogleConfigured() ? 'sau cu email' : 'continuă cu email'}
        <span className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
      </div>

      {/* Email form */}
      <form onSubmit={demoSubmit} className="space-y-3">
        <div className="relative">
          <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Numele tău"
            className="input-field pl-9"
            required
          />
        </div>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplu.ro"
            className="input-field pl-9"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full py-2.5 text-sm">
          <LogIn size={16} /> Intră în cont
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-navy-400">
        Datele tale rămân pe acest dispozitiv. {!isGoogleConfigured() && 'Google Sign-In se activează cu VITE_GOOGLE_CLIENT_ID.'}
      </p>
    </Modal>
  );
}
