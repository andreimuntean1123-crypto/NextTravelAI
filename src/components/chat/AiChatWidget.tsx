import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles, Bot, Trash2, Mic, Volume2, VolumeX, KeyRound, Check, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { sendToAgent, isLiveAiConfigured } from '@/lib/aiService';
import { getAiConfig, setAiConfig, clearAiConfig } from '@/lib/aiConfig';
import { WELCOME_MESSAGE, DEFAULT_SUGGESTIONS, makeMessage } from '@/lib/aiChat';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import {
  speak,
  cancelSpeech,
  isSpeechSynthesisSupported,
  langToLocale,
} from '@/lib/speech';
import { loadStorage, saveStorage } from '@/lib/storage';
import type { ChatMessage } from '@/types';

export function AiChatWidget() {
  const { preferences, saveConversation, t, language } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    makeMessage('assistant', WELCOME_MESSAGE, { suggestions: DEFAULT_SUGGESTIONS }),
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [voiceOut, setVoiceOut] = useState<boolean>(() => loadStorage('voiceOut', false));
  const [showSettings, setShowSettings] = useState(false);
  const [cfgVersion, setCfgVersion] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const convIdRef = useRef(`conv-${Date.now()}`);
  const { supported: micSupported, listening, interim, start, stop } = useSpeechRecognition();
  const liveAi = useMemo(() => isLiveAiConfigured(), [cfgVersion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Persistă preferința de voce și oprește vocea când e dezactivată/închis.
  useEffect(() => saveStorage('voiceOut', voiceOut), [voiceOut]);
  useEffect(() => {
    if (!voiceOut || !open) cancelSpeech();
  }, [voiceOut, open]);

  const toggleMic = () => {
    if (listening) {
      stop();
    } else {
      cancelSpeech();
      start(langToLocale(language), (finalText) => {
        setInput('');
        send(finalText);
      });
    }
  };

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
    if (voiceOut) speak(reply.content, language);
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
                  <span className={`h-1.5 w-1.5 rounded-full ${liveAi ? 'bg-turquoise-400' : 'bg-gold-400'}`} />
                  {liveAi ? 'Conectat la Claude' : 'Mod demonstrativ • online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings((s) => !s)}
                aria-label="Cheie API / setări agent"
                title="Conectează-ți cheia API"
                className={`grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 ${liveAi ? 'text-turquoise-300' : 'text-gold-400'}`}
              >
                <KeyRound size={16} />
              </button>
              {isSpeechSynthesisSupported() && (
                <button
                  onClick={() => {
                    setVoiceOut((v) => !v);
                    cancelSpeech();
                  }}
                  aria-label={voiceOut ? 'Oprește vocea agentului' : 'Pornește vocea agentului'}
                  title={voiceOut ? 'Vocea agentului: pornită' : 'Vocea agentului: oprită'}
                  className={`grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 ${voiceOut ? 'text-turquoise-300' : ''}`}
                >
                  {voiceOut ? <Volume2 size={17} /> : <VolumeX size={17} />}
                </button>
              )}
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

          {/* Settings / API key */}
          {showSettings && (
            <ApiKeySettings
              liveAi={liveAi}
              onClose={() => setShowSettings(false)}
              onSaved={() => setCfgVersion((v) => v + 1)}
            />
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-sand-50 p-4 dark:bg-navy-950">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onSuggestion={send} />
            ))}
            {typing && <TypingIndicator />}
          </div>

          {/* Listening indicator */}
          {listening && (
            <div className="flex items-center gap-2 border-t border-navy-100 bg-turquoise-50 px-4 py-2 text-sm text-turquoise-700 dark:border-navy-800 dark:bg-navy-800 dark:text-turquoise-300">
              <span className="flex items-center gap-1">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="h-3 w-1 animate-pulse rounded-full bg-turquoise-500" style={{ animationDelay: `${d}ms` }} />
                ))}
              </span>
              <span className="flex-1 truncate">{interim || 'Ascult... vorbește acum'}</span>
              <button onClick={stop} className="text-xs font-semibold underline">
                Stop
              </button>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-navy-100 bg-white p-3 dark:border-navy-800 dark:bg-navy-900"
          >
            {micSupported && (
              <button
                type="button"
                onClick={toggleMic}
                aria-label={listening ? 'Oprește microfonul' : 'Vorbește'}
                title={listening ? 'Oprește microfonul' : 'Vorbește cu agentul'}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
                  listening
                    ? 'animate-pulse bg-red-500 text-white'
                    : 'bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-sand-200'
                }`}
              >
                <Mic size={18} />
              </button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? 'Ascult...' : t('chat.placeholder')}
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

function ApiKeySettings({
  liveAi,
  onClose,
  onSaved,
}: {
  liveAi: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const cfg = getAiConfig();
  const [apiKey, setApiKey] = useState(cfg.apiKey);
  const [model, setModel] = useState(cfg.model);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setAiConfig({
      provider: apiKey.trim() ? 'anthropic' : 'demo',
      apiKey: apiKey.trim(),
      model: model.trim() || 'claude-opus-4-8',
    });
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  const disconnect = () => {
    clearAiConfig();
    setApiKey('');
    onSaved();
  };

  return (
    <div className="border-b border-navy-100 bg-white p-4 dark:border-navy-800 dark:bg-navy-900">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <KeyRound size={15} className="text-turquoise-500" /> Conectează agentul real (Claude)
        </h4>
        <button onClick={onClose} className="text-navy-400 hover:text-navy-600" aria-label="Închide">
          <X size={16} />
        </button>
      </div>
      <p className="mb-3 text-xs text-navy-500 dark:text-sand-200/70">
        Lipește cheia ta Anthropic (începe cu <code>sk-ant-</code>) ca agentul să te înțeleagă și să
        vorbească liber cu tine. Fără cheie, rămâne în mod demonstrativ.
      </p>

      <label className="mb-1 block text-xs font-medium">Cheie API</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="sk-ant-..."
        className="input-field mb-2 py-2 text-sm"
        autoComplete="off"
      />

      <label className="mb-1 block text-xs font-medium">Model</label>
      <select value={model} onChange={(e) => setModel(e.target.value)} className="input-field mb-3 py-2 text-sm">
        <option value="claude-opus-4-8">Claude Opus 4.8 (cel mai capabil)</option>
        <option value="claude-sonnet-5">Claude Sonnet 5 (rapid, echilibrat)</option>
        <option value="claude-haiku-4-5">Claude Haiku 4.5 (cel mai ieftin)</option>
      </select>

      <div className="flex items-center gap-2">
        <button onClick={save} className="btn-primary flex-1 py-2 text-sm">
          {saved ? (<><Check size={15} /> Salvat!</>) : 'Salvează și conectează'}
        </button>
        {liveAi && (
          <button onClick={disconnect} className="btn-outline px-3 py-2 text-sm text-red-500">
            Deconectează
          </button>
        )}
      </div>

      <a
        href="https://console.anthropic.com/settings/keys"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center gap-1 text-xs text-turquoise-600 dark:text-turquoise-300"
      >
        <ExternalLink size={12} /> De unde iau o cheie API?
      </a>
      <p className="mt-2 text-[11px] leading-relaxed text-navy-400">
        ⚠️ Cheia se salvează în browserul tău (localStorage) și se folosește direct din browser — e
        ok pentru uz personal, dar nu o partaja pe un dispozitiv public.
      </p>
    </div>
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
