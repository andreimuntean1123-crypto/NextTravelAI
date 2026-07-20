import { useState } from 'react';
import { KeyRound, Check, ExternalLink, X } from 'lucide-react';
import { getAiConfig, setAiConfig, clearAiConfig } from '@/lib/aiConfig';
import { isLiveAiConfigured } from '@/lib/aiService';

interface Props {
  onSaved?: () => void;
  onClose?: () => void;
  compact?: boolean; // stil compact pentru chat
}

// Formular reutilizabil pentru conectarea cheii API (Claude).
export function ApiKeyForm({ onSaved, onClose, compact }: Props) {
  const cfg = getAiConfig();
  const [apiKey, setApiKey] = useState(cfg.apiKey);
  const [model, setModel] = useState(cfg.model);
  const [saved, setSaved] = useState(false);
  const [live, setLive] = useState(isLiveAiConfigured());

  const save = () => {
    setAiConfig({
      provider: apiKey.trim() ? 'anthropic' : 'demo',
      apiKey: apiKey.trim(),
      model: model.trim() || 'claude-opus-4-8',
    });
    setSaved(true);
    setLive(isLiveAiConfigured());
    onSaved?.();
    setTimeout(() => setSaved(false), 2000);
  };

  const disconnect = () => {
    clearAiConfig();
    setApiKey('');
    setLive(false);
    onSaved?.();
  };

  return (
    <div className={compact ? 'p-4' : 'card-surface p-6'}>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <KeyRound size={16} className="text-turquoise-500" /> Conectează agentul real (Claude)
        </h4>
        {onClose ? (
          <button onClick={onClose} className="text-navy-400 hover:text-navy-600" aria-label="Închide">
            <X size={16} />
          </button>
        ) : (
          <span
            className={`chip text-xs ${live ? 'bg-turquoise-50 text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300' : 'bg-gold-400/15 text-gold-600'}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-turquoise-500' : 'bg-gold-400'}`} />
            {live ? 'Conectat' : 'Mod demo'}
          </span>
        )}
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
          {saved ? (
            <>
              <Check size={15} /> Salvat!
            </>
          ) : (
            'Salvează și conectează'
          )}
        </button>
        {live && (
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
        ⚠️ Cheia se salvează în browserul tău (localStorage) și se folosește direct din browser — e ok
        pentru uz personal, dar nu o introdu pe un dispozitiv public/partajat.
      </p>
    </div>
  );
}
