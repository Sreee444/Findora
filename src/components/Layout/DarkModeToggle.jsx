import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className={`fixed z-50 bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full shadow-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
        ${dark
          ? 'bg-gray-900 text-yellow-300 border-yellow-400 hover:bg-gray-800'
          : 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200'}`}
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <span className="text-2xl" role="img" aria-label="Dark mode">🌙</span>
      ) : (
        <span className="text-2xl" role="img" aria-label="Light mode">☀️</span>
      )}
    </button>
  );
}
