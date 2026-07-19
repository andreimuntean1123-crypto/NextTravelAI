import { createContext, useContext, useState, type ReactNode } from 'react';
import { Questionnaire } from '@/components/questionnaire/Questionnaire';

interface QuestionnaireContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const Ctx = createContext<QuestionnaireContextValue | null>(null);

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
  return (
    <Ctx.Provider value={value}>
      {children}
      {isOpen && <Questionnaire onClose={() => setIsOpen(false)} />}
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuestionnaire(): QuestionnaireContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useQuestionnaire trebuie folosit în <QuestionnaireProvider>');
  return ctx;
}
