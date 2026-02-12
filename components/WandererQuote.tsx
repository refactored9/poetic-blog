"use client";

import { useState, useEffect } from "react";

const quotes = [
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "The mountains are calling and I must go.", author: "John Muir" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.", author: "Marcel Proust" },
  { text: "Wherever you go, go with all your heart.", author: "Confucius" },
  { text: "One travels more usefully when alone, because he reflects more.", author: "Thomas Jefferson" },
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "He who would travel happily must travel light.", author: "Antoine de Saint-Exupery" },
  { text: "To move, to breathe, to fly, to float; to roam the roads of lands remote.", author: "Goethe" },
  { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir" },
];

interface WandererQuoteProps {
  interval?: number;
  className?: string;
}

export default function WandererQuote({ interval = 10000, className = "" }: WandererQuoteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  const quote = quotes[currentIndex];

  return (
    <div className={`text-center py-6 md:py-8 ${className}`}>
      <div
        className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <p className="font-serif italic text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto px-6 leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-xs md:text-sm text-[var(--muted-soft)] mt-2">
          &mdash; {quote.author}
        </p>
      </div>
    </div>
  );
}
