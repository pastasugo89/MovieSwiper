import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/types/tmdb';

interface WatchlistState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isLiked: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (movie) => {
        const { watchlist } = get();
        if (!watchlist.some((m) => m.id === movie.id)) {
          set({ watchlist: [...watchlist, movie] });
        }
      },
      removeFromWatchlist: (movieId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== movieId),
        }));
      },
      isLiked: (movieId) => {
        return get().watchlist.some((m) => m.id === movieId);
      },
    }),
    {
      name: 'movie-swiper-watchlist', // unique name
    }
  )
);
