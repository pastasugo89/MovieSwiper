"use client";

import { useState, useEffect } from "react";
import { Movie, MovieDetails, WatchProvidersResponse, WatchProvider } from "@/types/tmdb";
import { getMovieDetails, getMovieWatchProviders } from "@/app/actions/movies";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Clock, Calendar, BookmarkPlus, X } from "lucide-react";

interface MovieDetailsDrawerProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWatchlist: () => void;
}

export function MovieDetailsDrawer({ movie, isOpen, onClose, onAddToWatchlist }: MovieDetailsDrawerProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [providers, setProviders] = useState<WatchProvidersResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      setLoading(true);
      Promise.all([
        getMovieDetails(movie.id),
        getMovieWatchProviders(movie.id)
      ]).then(([detailsData, providersData]) => {
        setDetails(detailsData);
        setProviders(providersData);
        setLoading(false);
      }).catch((err) => {
        console.error("Error fetching details:", err);
        setLoading(false);
      });
    } else {
        // Reset state when closed
        setDetails(null);
        setProviders(null);
    }
  }, [isOpen, movie]);

  if (!movie) return null;

  // Provider Categorization
  const itProviders = providers?.results?.IT;
  const flatrate = itProviders?.flatrate || [];
  const rent = itProviders?.rent || [];
  const buy = itProviders?.buy || [];

  const hasProviders = flatrate.length > 0 || rent.length > 0 || buy.length > 0;
  
  // Format runtime
  const runtime = details?.runtime 
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : "N/A";

  const ProviderList = ({ title, list }: { title: string, list: WatchProvider[] }) => {
      if (!list || list.length === 0) return null;
      return (
          <div className="mb-4">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{title}</h4>
              <div className="flex items-center gap-3 flex-wrap">
                {list.slice(0, 5).map((provider) => (
                    <div key={provider.provider_id} title={provider.provider_name} className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white/5">
                        <Image
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
          </div>
      );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-zinc-950 border-t border-white/10 max-h-[90dvh] h-[90dvh] outline-none z-[60] flex flex-col">
        <div className="w-full max-w-md mx-auto flex flex-col h-full overflow-hidden relative">
           {/* Header Image Background Effect (Optional but cool) */}
           <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/0 to-zinc-950 z-0 pointer-events-none opacity-50" />

          <DrawerHeader className="relative z-10 text-left pt-6 pb-2 shrink-0">
            <div className="flex gap-4 items-start">
                 {/* Mini Poster */}
                 <div className="relative w-20 aspect-2/3 rounded-lg overflow-hidden shadow-lg shrink-0 border border-white/10">
                    <Image 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : "/placeholder-movie.jpg"}
                        alt={movie.title}
                        fill
                        className="object-cover"
                    />
                 </div>
                 
                 <div className="flex flex-col gap-1">
                    <DrawerTitle className="text-2xl font-bold text-white leading-tight">
                        {movie.title}
                    </DrawerTitle>
                    <DrawerDescription asChild>
                        <div className="flex items-center gap-3 text-zinc-400 text-sm mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} /> 
                                {new Date(movie.release_date).getFullYear()}
                            </span>
                            {loading ? (
                                <Skeleton className="h-4 w-16 bg-zinc-800" />
                            ) : (
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {runtime}
                                </span>
                            )}
                        </div>
                    </DrawerDescription>
                 </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10">
             {/* Overview */}
             <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-white mb-2">Trama</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                        {movie.overview || "Nessuna trama disponibile."}
                    </p>
                </div>

                {/* Streaming Providers */}
                <div>
                    <h3 className="text-sm font-medium text-white mb-3">Disponibile su</h3>
                    {loading ? (
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="w-10 h-10 rounded-xl bg-zinc-800" />)}
                        </div>
                    ) : hasProviders ? (
                        <div>
                            <ProviderList title="Streaming" list={flatrate} />
                            <ProviderList title="Noleggio" list={rent} />
                            <ProviderList title="Acquisto" list={buy} />
                        </div>
                    ) : (
                        <p className="text-zinc-500 text-sm italic py-2">
                            Disponibile solo al cinema o non ancora in streaming.
                        </p>
                    )}
                </div>
             </div>
          </div>

          <DrawerFooter className="pt-4 shrink-0 bg-zinc-950 border-t border-white/5" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
            <button 
                onClick={onAddToWatchlist}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition flex items-center justify-center gap-2"
            >
                <BookmarkPlus size={20} />
                Aggiungi alla Watchlist
            </button>
            <DrawerClose asChild>
                <button className="w-full py-3 rounded-2xl bg-zinc-900 text-zinc-400 font-medium text-sm hover:text-white hover:bg-zinc-800 transition">
                    Chiudi
                </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
