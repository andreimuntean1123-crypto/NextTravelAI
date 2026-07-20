import { useEffect, useRef, useState } from 'react';
import { LogIn, Mail, User as UserIcon, Sparkles } from 'lucide-react';
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
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-turquoise-400 to-navy-700 text-white">
          <LogIn size={26} />
        </span>
        <h2 className="text-2xl font-bold">Bine ai venit!</h2>
        <p className="mt-1 text-sm text-navy-500 dark:text-sand-200/70">
          Conectează-te ca să îți salvezi favoritele, itinerarele și istoricul.
        </p>
      </div>

      {/* Google */}
      {isGoogleConfigured() ? (
        <div className="mt-6 flex justify-center">
          <div ref={googleRef} />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-navy-200 p-4 text-center text-xs text-navy-500 dark:border-navy-700 dark:text-sand-200/70">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-gold-500" /> Autentificare Google (mod demo)
          </p>
          <p className="mt-1">
            Butonul oficial Google apare automat după ce adaugi{' '}
            <code className="rounded bg-navy-100 px-1 dark:bg-navy-800">VITE_GOOGLE_CLIENT_ID</code> în
            variabilele de mediu. Momentan poți intra rapid mai jos.
          </p>
        </div>
      )}
      {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}

      {/* Separator */}
      <div className="my-5 flex items-center gap-3 text-xs text-navy-400">
        <span className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
        sau continuă cu email
        <span className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
      </div>

      {/* Demo / email form */}
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

      <p className="mt-4 text-center text-xs text-navy-400">
        Datele tale rămân pe acest dispozitiv (localStorage). Nu trimitem nimic în afară în modul demo.
      </p>
    </Modal>
  );
}
