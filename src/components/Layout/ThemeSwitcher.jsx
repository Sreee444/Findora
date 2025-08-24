import React, { useState } from 'react';

export default function ThemeSwitcher() {
  const [dark, setDark] = useState(false);
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);
  return (
    <button
      className="absolute top-4 right-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs shadow"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}