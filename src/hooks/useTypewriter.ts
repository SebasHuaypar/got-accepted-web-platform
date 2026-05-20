"use client";

import { useState, useEffect, useRef } from "react";

/**
 * useTypewriter — a reusable typewriter hook that cycles through phrases.
 *
 * Uses refs for mutable state to avoid redundant React re-renders on every
 * character tick. Only calls setState with the displayText that is rendered.
 *
 * @param phrases - Array of strings to cycle through
 * @returns { text } — the current display text
 */
export function useTypewriter(phrases: string[]): { text: string } {
  const [text, setText] = useState("");

  // Mutable state via refs — avoids stale closure issues and unnecessary re-renders
  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phrasesRef = useRef(phrases);

  // Keep phrasesRef in sync if the caller changes phrases (rare but safe)
  useEffect(() => {
    phrasesRef.current = phrases;
  }, [phrases]);

  useEffect(() => {
    const tick = () => {
      const currentPhrases = phrasesRef.current;
      const phraseIndex = phraseIndexRef.current % currentPhrases.length;
      const currentPhrase = currentPhrases[phraseIndex];
      const isDeleting = isDeletingRef.current;
      const charIndex = charIndexRef.current;

      if (isDeleting) {
        charIndexRef.current = charIndex - 1;
        setText(currentPhrase.substring(0, charIndex - 1));
      } else {
        charIndexRef.current = charIndex + 1;
        setText(currentPhrase.substring(0, charIndex + 1));
      }

      let delay = isDeleting ? 40 : 80 + Math.random() * 40;

      if (!isDeleting && charIndexRef.current === currentPhrase.length) {
        // Pause at end of word before deleting — Stay for 3 seconds
        isDeletingRef.current = true;
        delay = 3000;
      } else if (isDeleting && charIndexRef.current === 0) {
        // Move to next phrase
        isDeletingRef.current = false;
        phraseIndexRef.current = phraseIndexRef.current + 1;
        delay = 800;
      }

      timeoutRef.current = setTimeout(tick, delay);
    };

    // Pause animation when tab is hidden (saves CPU)
    const handleVisibilityChange = () => {
      if (document.hidden && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      } else if (!document.hidden) {
        timeoutRef.current = setTimeout(tick, 200);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    timeoutRef.current = setTimeout(tick, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Intentionally runs once — all state is managed via refs

  return { text };
}
