"use client";

import { useState } from "react";
import { Movie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useWatchlist } from "@/hooks/use-watchlist";

interface CardStackProps {
  initialMovies: Movie[];
}

export function CardStack({ initialMovies }: CardStackProps) {
  const [movies] = useState<Movie[]>(initialMovies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addMovie } = useWatchlist();

  // Show top 3 cards
  const visibleCards = movies.slice(currentIndex, currentIndex + 3).reverse();

  const handleSwipe = (direction: "left" | "right") => {
    // Logic for "Saved" or "Discarded"
    if (direction === "right") {
        console.log("Film salvato!");
        const currentMovie = movies[currentIndex];
        if (currentMovie) {
            addMovie(currentMovie);
        }
    } else {
        console.log("Film scartato");
    }

    // Delay index update slightly to allow exit animation to start in MovieCard
    setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
    }, 200);
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
             const stackIndex = visibleCards.length - 1 - index;
             const isTop = stackIndex === 0;

            return (
              <motion.div
                key={movie.id}
                className="absolute inset-0 origin-bottom"
                initial={false}
                style={{ 
                    zIndex: index,
                }}
                animate={{
                    scale: 1 - stackIndex * 0.05,
                    y: stackIndex * 15,
                    opacity: 1 - stackIndex * 0.1,
                }}
                transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 30
                }}
              >
                <MovieCard 
                    movie={movie} 
                    active={isTop} 
                    onSwipe={isTop ? handleSwipe : undefined}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Empty state */}
        {currentIndex >= movies.length && (
             <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-muted-foreground bg-zinc-900/50 rounded-3xl border border-white/10">
                <p>Non ci sono altri film!</p>
             </div>
        )}
      </div>

       {/* Manual Controls */}
       <div className="flex gap-4">
        <button
            onClick={() => handleSwipe("left")}
            disabled={currentIndex >= movies.length}
            className="p-4 rounded-full bg-zinc-800 text-red-500 hover:bg-zinc-700 transition disabled:opacity-50"
        >
            <span className="sr-only">Scarta</span>
            ✕
        </button>
        <button
            onClick={() => handleSwipe("right")}
            disabled={currentIndex >= movies.length}
            className="p-4 rounded-full bg-zinc-800 text-green-500 hover:bg-zinc-700 transition disabled:opacity-50"
        >
             <span className="sr-only">Mantieni</span>
            ♥
        </button>
       </div>
    </div>
  );
}
