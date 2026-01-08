import { useState, useEffect } from 'react';
import { Movie } from '@/types/tmdb';

const STORAGE_KEY = 'netflix-scroll-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse watchlist", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  const addMovie = (movie: Movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  const removeMovie = (movieId: number) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isLiked = (movieId: number) => {
    return watchlist.some((m) => m.id === movieId);
  };

  return { watchlist, addMovie, removeMovie, isLiked };
}
