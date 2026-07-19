import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles, Bot, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { sendToAgent, isLiveAiConfigured } from '@/lib/aiService';
import { WELCOME_MESSAGE, DEFAULT_SUGGESTIONS, makeMessage } from '@/lib/aiChat';
import type { ChatMessage } from '@/types';

export function AiChatWidget() {
  const { preferences, saveConversation, t } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    makeMessage('assistant', WELCOME_MESSAGE, { suggestions: DEFAULT_SUGGESTIONS }),
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const convIdRef = useRef(`conv-${Date.now()}`);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const persist = (msgs: ChatMessage[]) => {
    const firstUser = msgs.find((m) => m.role === 'user');
    saveConversation({
      id: convIdRef.current,
      title: firstUser ? firstUser.content.slice(0, 40) : 'Conversație nouă',
      messages: msgs,
      createdAt: Date.now(),
    });
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg = makeMessage('user', trimmed);
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setTyping(true);

    const reply = await sendToAgent(trimmed, next, preferences);
    const finalMsgs = [...next, reply];
    setMessages(finalMsgs);
    setTyping(false);
    persist(finalMsgs);
  };

  const reset = () => {
    convIdRef.current = `conv-${Date.now()}`;
    setMessages([makeMessage('assistant', WELCOME_MESSAGE, { suggestions: DEFAULT_SUGGESTIONS })]);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            setPulse(false);
          }}
          className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-br from-turquoise-400 to-turquoise-600 px-4 py-3.5 text-navy-950 shadow-soft-lg transition hover:scale-105 sm:bottom-6 sm:right-6"
          aria-label="Deschide agentul AI"
        >
          <span className="relative">
            <MessageCircle size={24} />
            {pulse && (
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-gold-400" />
            )}
          </span>
          <span className="hidden text-sm font-semibold sm:inline">Agent AI</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col overflow-hidden bg-white shadow-soft-lg dark:bg-navy-900 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-3xl sm:border sm:border-navy-100 sm:dark:border-navy-800 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-navy-800 to-navy-700 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-turquoise-500 text-navy-950">
                <Bot size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold">{t('chat.title')}</p>
                <p className="flex items-center gap-1 text-xs text-sand-100/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-turquoise-400" />
                  {isLiveAiConfigured() ? 'Conectat la API' : 'Mod demonstrativ • online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                aria-label="Conversație nouă"
                title="Conversație nouă"
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Închide"
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-sand-50 p-4 dark:bg-navy-950">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onSuggestion={send} />
            ))}
            {typing && <TypingIndicator />}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-navy-100 bg-white p-3 dark:border-navy-800 dark:bg-navy-900"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="input-field flex-1 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="btn-primary h-11 w-11 shrink-0 p-0"
              aria-label="Trimite"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function MessageBubble({
  message,
  onSuggestion,
}: {
  message: ChatMessage;
  onSuggestion: (text: string) => void;
}) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-turquoise-500 text-navy-950'
            : 'rounded-bl-md bg-white text-navy-800 shadow-soft dark:bg-navy-800 dark:text-sand-100'
        }`}
      >
        <FormattedText text={message.content} />
      </div>

      {/* Recomandări inline */}
      {message.recommendations && message.recommendations.length > 0 && (
        <div className="w-full space-y-2">
          {message.recommendations.map((r) => (
            <Link
              key={r.destination.id}
              to={`/destinatie/${r.destination.id}`}
              className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-2 transition hover:border-turquoise-400 dark:border-navy-700 dark:bg-navy-800"
            >
              <img
                src={r.destination.image}
                alt={r.destination.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{r.destination.name}</p>
                <p className="text-xs text-navy-500 dark:text-sand-200/70">
                  {r.destination.country} • {r.matchScore}% potrivire
                </p>
              </div>
              <span className="text-xs font-bold text-turquoise-600">~{r.estimatedPrice}€</span>
            </Link>
          ))}
        </div>
      )}

      {/* Sugestii rapide */}
      {message.suggestions && message.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {message.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestion(s)}
              className="chip border border-turquoise-300 bg-turquoise-50 text-turquoise-700 transition hover:bg-turquoise-100 dark:border-navy-600 dark:bg-navy-800 dark:text-turquoise-300"
            >
              <Sparkles size={12} /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Redă **bold** minim din răspunsuri.
function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-soft dark:bg-navy-800 w-fit">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="h-2 w-2 animate-bounce rounded-full bg-turquoise-400"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  );
}
