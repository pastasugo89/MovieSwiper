"use client";

import { useState } from "react";
import { Movie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

interface CardStackProps {
  initialMovies: Movie[];
}

export function CardStack({ initialMovies }: CardStackProps) {
  const [movies] = useState<Movie[]>(initialMovies);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show top 3 cards for performance and visual effect
  // Reverse order for rendering so the first card is on top (last in DOM)
  const visibleCards = movies.slice(currentIndex, currentIndex + 3).reverse();

  const handleNext = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
        // Optional: Loop back or fetch more
        // setCurrentIndex(0); 
    }
  };

  if (!movies.length) {
    return (
        <div className="w-full h-full relative aspect-2/3 rounded-3xl overflow-hidden">
            <Skeleton className="w-full h-full bg-zinc-800" />
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="relative w-full aspect-2/3">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((movie, index) => {
             // Calculate actual index in the "stack" (0 is top card, 1 is behind, etc.)
             // Since we reversed visibleCards, the last element is the top card (stackIndex 0)
             const stackIndex = visibleCards.length - 1 - index;
             const isTop = stackIndex === 0;

            return (
              <motion.div
                key={movie.id}
                className="absolute inset-0 origin-bottom"
                initial={false}
                animate={{
                  scale: 1 - stackIndex * 0.05, // 1, 0.95, 0.90
                  y: stackIndex * 15, // 0, 15, 30
                  zIndex: visibleCards.length - index,
                  opacity: 1 - stackIndex * 0.1, // Fade out cards behind
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
              >
                <MovieCard movie={movie} priority={isTop} />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Empty state when deck is finished */}
        {currentIndex >= movies.length && (
             <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-muted-foreground bg-zinc-900/50 rounded-3xl border border-white/10">
                <p>Non ci sono altri film!</p>
             </div>
        )}
      </div>

      {/* Temporary Control */}
      <button
        onClick={handleNext}
        disabled={currentIndex >= movies.length}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Successivo <ArrowRight size={20} />
      </button>
    </div>
  );
}
