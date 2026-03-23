"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <div className="w-10 h-10 border-2 border-transparent" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-10 h-10 bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-300 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_#27272a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] dark:hover:shadow-[1px_1px_0px_0px_#27272a] transition-all"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={20} className="hover:text-neon-lime transition-colors" />
      ) : (
        <Moon size={20} className="hover:text-neon-indigo transition-colors" />
      )}
    </button>
  );
}
