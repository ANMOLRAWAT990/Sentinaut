import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-[#8b949e] dark:hover:bg-[#21262d] dark:hover:text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
