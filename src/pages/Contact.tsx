import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, MessageCircle } from 'lucide-react';

export function Contact() {
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
        <h1 className="text-3xl font-bold sm:text-4xl">Contact</h1>
        <p className="mx-auto mt-2 max-w-xl text-navy-500 dark:text-sand-200/70">
          Ai o întrebare sau o sugestie? Suntem aici să te ajutăm să planifici vacanța perfectă.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Info */}
        <div className="space-y-4">
          <ContactCard icon={<Mail size={20} />} title="Email" value="salut@nexttravelai.ro" note="Răspundem în maxim 24h" />
          <ContactCard icon={<Phone size={20} />} title="Telefon" value="+40 721 000 000" note="Luni–Vineri, 9:00–18:00" />
          <ContactCard icon={<MapPin size={20} />} title="Birou" value="Str. Călătorilor 10, București" note="Programare în prealabil" />
          <ContactCard icon={<MessageCircle size={20} />} title="Chat AI" value="Disponibil 24/7" note="Butonul din dreapta jos" />
        </div>

        {/* Form */}
        <div className="card-surface p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-scale-in">
              <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-turquoise-500 text-navy-950">
                <Check size={30} />
              </span>
              <h3 className="text-xl font-semibold">Mesaj trimis!</h3>
              <p className="mt-2 text-navy-500 dark:text-sand-200/70">
                Îți mulțumim. Revenim cu un răspuns cât de curând.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Nume</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Numele tău"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="email@exemplu.ro"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Subiect</span>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-field"
                  placeholder="Cu ce te putem ajuta?"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Mesaj</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Scrie-ne mesajul tău..."
                />
              </label>
              <button type="submit" className="btn-primary w-full py-3 text-sm">
                <Send size={16} /> Trimite mesajul
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
