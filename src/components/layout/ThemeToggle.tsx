"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes can't know the real theme until after mount (it reads
  // localStorage/system preference client-side) — render a neutral,
  // non-interactive placeholder until then so server and client markup
  // match and nothing flashes the wrong icon.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: flips only after mount so server/client markup match on first paint
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div aria-hidden className={`h-10 w-10 shrink-0 ${className}`} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.04] hover:text-orisirisi ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -55, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 55, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.16, 0.84, 0.44, 1] }}
          className="flex"
        >
          {isDark ? <Moon size={19} strokeWidth={1.7} /> : <Sun size={19} strokeWidth={1.7} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
