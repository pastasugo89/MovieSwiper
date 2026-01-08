"use client";

import { useWatchlistStore } from "@/store/useWatchlistStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Home, Film, Popcorn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlistStore();

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
         <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-500">
             <Popcorn size={40} />
         </div>
         <h1 className="text-3xl font-bold mb-2">Lista vuota</h1>
         <p className="text-zinc-400 mb-8 max-w-xs">
            Non hai ancora salvato nessun film. Torna alla home e inizia a scorrere!
         </p>
         <Link 
            href="/"
            className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition flex items-center gap-2"
         >
            <Home size={20} />
            Vai alla Home
         </Link>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-6">
        <div className="max-w-[450px] mx-auto flex items-center gap-3">
             <Film className="text-primary" size={24} />
             <h1 className="text-xl font-bold">La tua Watchlist <span className="text-zinc-500 text-sm font-normal">({watchlist.length})</span></h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
         <div className="max-w-[450px] mx-auto px-4 pt-24" style={{ paddingBottom: 'calc(8rem + env(safe-area-inset-bottom))' }}>
        <div className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
                {watchlist.map((movie) => (
                    <motion.div 
                        layout
                        key={movie.id} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group aspect-2/3 rounded-xl overflow-hidden bg-zinc-900 border border-white/10"
                    >
                        <Image
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder-movie.jpg"}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 450px) 50vw, 200px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-sm font-bold leading-tight mb-2 line-clamp-2">{movie.title}</h3>
                            <button
                                onClick={() => removeFromWatchlist(movie.id)}
                                className="w-full py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2"
                            >
                                <Trash2 size={14} />
                                Rimuovi
                            </button>
                        </div>
                        {/* Always visible remove button on mobile (touch devices usually don't hover well) */}
                        <button
                            onClick={() => removeFromWatchlist(movie.id)}
                            className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-full text-white/70 hover:text-red-500 transition md:hidden"
                        >
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>
      </main>
    </div>
  );
}
