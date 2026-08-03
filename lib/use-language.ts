"use client";

import { useEffect, useState } from "react";

export type Language = "en" | "bn";

const STORAGE_KEY = "bangla-adventures-language";

/**
 * Client hook for the shared English/Bangla preference used across the learner
 * and grown-up surfaces. The preference is read after mount to avoid an SSR
 * hydration mismatch and persisted to localStorage so it carries between pages.
 */
export function useLanguage(): [Language, () => void] {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage((current) => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === "bn" || saved === "en" ? saved : current;
    });
  }, []);

  function toggle() {
    setLanguage((current) => {
      const next = current === "en" ? "bn" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return [language, toggle];
}
