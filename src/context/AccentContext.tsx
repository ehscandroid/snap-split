import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AccentColor {
  id: string;
  label: string;
  value: string;
  hover: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'blue',   label: 'Blue',   value: '#3b82f6', hover: '#2563eb' },
  { id: 'violet', label: 'Violet', value: '#7c3aed', hover: '#6d28d9' },
  { id: 'rose',   label: 'Rose',   value: '#f43f5e', hover: '#e11d48' },
  { id: 'emerald',label: 'Emerald',value: '#10b981', hover: '#059669' },
  { id: 'amber',  label: 'Amber',  value: '#f59e0b', hover: '#d97706' },
  { id: 'cyan',   label: 'Cyan',   value: '#06b6d4', hover: '#0891b2' },
  { id: 'slate',  label: 'Slate',  value: '#64748b', hover: '#475569' },
];

const STORAGE_KEY = 'app-accent';
const DEFAULT = ACCENT_COLORS[0];

interface AccentContextType {
  accent: AccentColor;
  setAccent: (color: AccentColor) => void;
}

const AccentContext = createContext<AccentContextType | undefined>(undefined);

export const AccentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<AccentColor>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return ACCENT_COLORS.find((c) => c.id === stored) ?? DEFAULT;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, accent.id);
    document.documentElement.style.setProperty('--accent', accent.value);
    document.documentElement.style.setProperty('--accent-hover', accent.hover);
  }, [accent]);

  const setAccent = (color: AccentColor) => setAccentState(color);

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
};

export const useAccent = (): AccentContextType => {
  const context = useContext(AccentContext);
  if (!context) throw new Error('useAccent must be used within AccentProvider');
  return context;
};
