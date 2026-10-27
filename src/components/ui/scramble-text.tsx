"use client";

import { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  duration?: number;
  className?: string;
  scrambleOnMount?: boolean;
}

const HEX_CHARS = "0123456789abcdef";

export function ScrambleText({
  text,
  duration = 350,
  className = "",
  scrambleOnMount = false,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && !scrambleOnMount) {
      isFirstRender.current = false;
      setDisplayText(text);
      return;
    }
    isFirstRender.current = false;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Settle characters from left to right as progress increases
      const settledCount = Math.floor(progress * text.length);

      let scrambled = "";
      for (let i = 0; i < text.length; i++) {
        if (i < settledCount) {
          scrambled += text[i];
        } else if (text[i] === " " || text[i] === "." || text[i] === "-" || text[i] === ":") {
          scrambled += text[i];
        } else {
          scrambled += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, duration, scrambleOnMount]);

  return <span className={`font-mono ${className}`}>{displayText}</span>;
}
