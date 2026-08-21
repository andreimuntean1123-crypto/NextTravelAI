import { useState } from 'react';
import { Mail, Check, Send } from 'lucide-react';
import { saveStorage, STORAGE_KEYS } from '@/lib/storage';
import { useApp } from '@/context/AppContext';

export function NewsletterSection() {
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    saveStorage(STORAGE_KEYS.newsletter, { email, date: Date.now() });
    setDone(true);
  };

  return (
    <section className="container-page py-14">
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-navy-800 via-navy-700 to-turquoise-700 px-6 py-14 text-center text-white sm:px-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-turquoise-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-xl">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur">
            <Mail size={26} className="text-gold-400" />
          </span>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            {t('newsletter.title')}
          </h2>
          <p className="mt-3 text-sand-100/80">
            {t('newsletter.subtitle')}
          </p>

          {done ? (
            <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-full bg-turquoise-500 px-6 py-3.5 font-medium text-navy-950 animate-scale-in">
              <Check size={18} /> {t('newsletter.success')}
            </div>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-white placeholder:text-sand-100/60 outline-none focus:border-turquoise-300 backdrop-blur"
              />
              <button className="btn-primary px-6 py-3.5">
                <Send size={16} /> {t('newsletter.cta')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
