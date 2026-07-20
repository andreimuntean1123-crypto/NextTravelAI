import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getRecognitionCtor,
  isSpeechRecognitionSupported,
  type SpeechRecognitionLike,
} from '@/lib/speech';

// Hook pentru recunoaștere vocală (voce → text).
export function useSpeechRecognition() {
  const supported = isSpeechRecognitionSupported();
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalRef = useRef<((text: string) => void) | null>(null);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(
    (locale: string, onFinal: (text: string) => void) => {
      const Ctor = getRecognitionCtor();
      if (!Ctor) return;
      // Oprește o sesiune anterioară, dacă există.
      recRef.current?.abort();

      const rec = new Ctor();
      rec.lang = locale;
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;
      onFinalRef.current = onFinal;

      rec.onresult = (e) => {
        let finalText = '';
        let interimText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          const transcript = res[0].transcript;
          if (res.isFinal) finalText += transcript;
          else interimText += transcript;
        }
        if (interimText) setInterim(interimText);
        if (finalText) {
          setInterim('');
          onFinalRef.current?.(finalText.trim());
        }
      };
      rec.onend = () => {
        setListening(false);
        setInterim('');
      };
      rec.onerror = () => {
        setListening(false);
        setInterim('');
      };

      recRef.current = rec;
      try {
        rec.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      recRef.current?.abort();
    };
  }, []);

  return { supported, listening, interim, start, stop };
}
