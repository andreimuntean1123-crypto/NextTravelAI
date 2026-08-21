import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Contact() {
  const { t } = useApp();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="container-page py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{t('contact.title')}</h1>
        <p className="mx-auto mt-2 max-w-xl text-navy-500 dark:text-sand-200/70">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Info */}
        <div className="space-y-4">
          <ContactCard icon={<Mail size={20} />} title={t('contact.email')} value="salut@nexttravelai.ro" note={t('contact.emailNote')} />
          <ContactCard icon={<Phone size={20} />} title={t('contact.phone')} value="+40 721 000 000" note={t('contact.phoneNote')} />
          <ContactCard icon={<MapPin size={20} />} title={t('contact.office')} value={t('contact.officeValue')} note={t('contact.officeNote')} />
          <ContactCard icon={<MessageCircle size={20} />} title={t('contact.chat')} value={t('contact.chatValue')} note={t('contact.chatNote')} />
        </div>

        {/* Form */}
        <div className="card-surface p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-scale-in">
              <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-turquoise-500 text-navy-950">
                <Check size={30} />
              </span>
              <h3 className="text-xl font-semibold">{t('contact.sentTitle')}</h3>
              <p className="mt-2 text-navy-500 dark:text-sand-200/70">
                {t('contact.sentText')}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium">{t('contact.formName')}</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder={t('contact.formNamePlaceholder')}
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium">{t('contact.formEmail')}</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder={t('contact.formEmailPlaceholder')}
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">{t('contact.formSubject')}</span>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-field"
                  placeholder={t('contact.formSubjectPlaceholder')}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">{t('contact.formMessage')}</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder={t('contact.formMessagePlaceholder')}
                />
              </label>
              <button type="submit" className="btn-primary w-full py-3 text-sm">
                <Send size={16} /> {t('contact.send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="card-surface flex items-center gap-4 p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-turquoise-50 text-turquoise-600 dark:bg-navy-800">
        {icon}
      </span>
      <div>
        <p className="text-xs text-navy-400">{title}</p>
        <p className="font-semibold">{value}</p>
        <p className="text-xs text-navy-400">{note}</p>
      </div>
    </div>
  );
}
