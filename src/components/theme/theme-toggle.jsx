"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const falseSubscribe = () => () => {};

export default function ThemeToggle({ className = "" }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    falseSubscribe,
    () => true,
    () => false
  );

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs outline-none transition hover:border-[#E64833]/40 hover:text-[#E64833] focus-visible:ring-2 focus-visible:ring-[#E64833]/60 dark:border-white/15 dark:bg-card dark:text-amber-300/90 dark:hover:border-[#E64833]/60 dark:hover:text-[#E64833] ${className}`}
    >
      {mounted &&
        (isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        ))}
      {!mounted && <Moon className="h-4 w-4 opacity-0" />}
    </button>
  );
}
