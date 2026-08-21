import { useState } from 'react';
import { KeyRound, Check, ExternalLink, X } from 'lucide-react';
import { getAiConfig, setAiConfig, clearAiConfig } from '@/lib/aiConfig';
import { isLiveAiConfigured } from '@/lib/aiService';
import { useApp } from '@/context/AppContext';

interface Props {
  onSaved?: () => void;
  onClose?: () => void;
  compact?: boolean; // stil compact pentru chat
}

// Formular reutilizabil pentru conectarea cheii API (Claude).
export function ApiKeyForm({ onSaved, onClose, compact }: Props) {
  const { t } = useApp();
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
          <KeyRound size={16} className="text-turquoise-500" /> {t('apiKey.title')}
        </h4>
        {onClose ? (
          <button onClick={onClose} className="text-navy-400 hover:text-navy-600" aria-label={t('apiKey.close')}>
            <X size={16} />
          </button>
        ) : (
          <span
            className={`chip text-xs ${live ? 'bg-turquoise-50 text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300' : 'bg-gold-400/15 text-gold-600'}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-turquoise-500' : 'bg-gold-400'}`} />
            {live ? t('apiKey.connected') : t('apiKey.demoMode')}
          </span>
        )}
      </div>

      <p className="mb-3 text-xs text-navy-500 dark:text-sand-200/70">
        {t('apiKey.description')}
      </p>

      <label className="mb-1 block text-xs font-medium">{t('apiKey.label')}</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="sk-ant-..."
        className="input-field mb-2 py-2 text-sm"
        autoComplete="off"
      />

      <label className="mb-1 block text-xs font-medium">{t('apiKey.model')}</label>
      <select value={model} onChange={(e) => setModel(e.target.value)} className="input-field mb-3 py-2 text-sm">
        <option value="claude-opus-4-8">Claude Opus 4.8</option>
        <option value="claude-sonnet-5">Claude Sonnet 5</option>
        <option value="claude-haiku-4-5">Claude Haiku 4.5</option>
      </select>

      <div className="flex items-center gap-2">
        <button onClick={save} className="btn-primary flex-1 py-2 text-sm">
          {saved ? (
            <>
              <Check size={15} /> {t('apiKey.saved')}
            </>
          ) : (
            t('apiKey.save')
          )}
        </button>
        {live && (
          <button onClick={disconnect} className="btn-outline px-3 py-2 text-sm text-red-500">
            {t('apiKey.disconnect')}
          </button>
        )}
      </div>

      <a
        href="https://console.anthropic.com/settings/keys"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center gap-1 text-xs text-turquoise-600 dark:text-turquoise-300"
      >
        <ExternalLink size={12} /> {t('apiKey.whereToGet')}
      </a>
      <p className="mt-2 text-[11px] leading-relaxed text-navy-400">
        {t('apiKey.warning')}
      </p>
    </div>
  );
}
