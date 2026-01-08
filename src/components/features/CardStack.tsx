"use client";

import { useState, useRef } from "react";
import { Movie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { MovieDetailsDrawer } from "@/components/features/MovieDetailsDrawer";
import { toast } from "sonner";
import { getDiscoverMovies } from "@/app/actions/movies";

interface CardStackProps {
  initialMovies: Movie[];
  startPage: number;
}

export function CardStack({ initialMovies, startPage }: CardStackProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextPage, setNextPage] = useState(startPage + 1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToWatchlist } = useWatchlistStore();
  
  // Drawer State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Show top 3 cards
  const visibleCards = movies.slice(currentIndex, currentIndex + 3).reverse();

  const loadMoreMovies = async () => {
    if (isLoading) return;
    setIsLoading(true);
    console.log(`Fetching more movies from page ${nextPage}...`);
    
    try {
        const newData = await getDiscoverMovies(nextPage);
        if (newData.results.length > 0) {
            setMovies(prev => [...prev, ...newData.results]);
            setNextPage(prev => prev + 1);
        }
    } catch (err) {
        console.error("Error loading more movies:", err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSwipe = (direction: "left" | "right") => {
    // Logic for "Saved" or "Discarded"
    if (direction === "right") {
        console.log("Film salvato! Apro i dettagli...");
        const currentMovie = movies[currentIndex];
        if (currentMovie) {
            // Delay drawer opening slightly for animation feeling
             setTimeout(() => {
                setSelectedMovie(currentMovie);
                setIsDrawerOpen(true);
            }, 300);
        }
    } else {
        console.log("Film scartato");
    }

    // Check if we need to buffer more movies
    // If we are significantly close to the end (e.g. 5 cards left), load more
    if (currentIndex >= movies.length - 5 && !isLoading) {
        loadMoreMovies();
    }

    // Delay index update to allow exit animation to start in MovieCard
    // Note: If we open the drawer, the card is already gone visually.
    setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
    }, 200);
  };
  
  const handleAddToWatchlist = () => {
    if (selectedMovie) {
        addToWatchlist(selectedMovie);
        toast.success("Aggiunto alla Watchlist", {
            description: selectedMovie.title
        });
        setIsDrawerOpen(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // User swiped right but decided not to add? 
    // Current requirement doesn't specify "undo" action, so we just close.
    // The card is already swiped away.
  };

  if (!movies.length) {
    return (
        <div className="w-full h-full relative aspect-2/3 rounded-3xl overflow-hidden">
            <Skeleton className="w-full h-full bg-zinc-800" />
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm" style={{ touchAction: 'none' }}>
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


       <MovieDetailsDrawer 
            movie={selectedMovie}
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            onAddToWatchlist={handleAddToWatchlist}
       />
    </div>
  );
}
