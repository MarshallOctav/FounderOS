import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { readTheme, writeTheme, type ThemeMode } from '@/lib/theme';

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => readTheme());

  useEffect(() => {
    const syncTheme = () => setTheme(readTheme());
    window.addEventListener('founderos:theme-updated', syncTheme);
    return () => window.removeEventListener('founderos:theme-updated', syncTheme);
  }, []);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        writeTheme(nextTheme);
        setTheme(nextTheme);
      }}
      className={cn(
        'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-700',
        className
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
