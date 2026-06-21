'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(null);

  // Sync initial state from the class the inline head script already applied.
  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.toggle('dark', next === 'dark');
    root.style.colorScheme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore storage errors */
    }
    setTheme(next);
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white ${className}`}
    >
      {/* Render nothing until mounted to avoid a hydration/icon mismatch */}
      {theme === null ? (
        <span className="h-5 w-5" aria-hidden="true" />
      ) : isDark ? (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M10 2a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-.708.706a.75.75 0 0 0 1.061 1.06l.707-.706ZM6.11 14.95a.75.75 0 0 0-1.06-1.06l-.708.706a.75.75 0 1 0 1.061 1.06l.707-.706ZM18 10a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-.706-.708a.75.75 0 1 0-1.06 1.061l.706.707ZM5.05 6.11a.75.75 0 0 0 1.06-1.06l-.706-.708a.75.75 0 1 0-1.061 1.061l.707.707Z" />
        </svg>
      )}
    </button>
  );
}
