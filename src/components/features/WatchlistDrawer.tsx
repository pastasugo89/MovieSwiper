"use client";

import { Movie } from "@/types/tmdb";
import { useWatchlist } from "@/hooks/use-watchlist";
import Image from "next/image";
import { Trash2, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WatchlistDrawerProps {
  children: React.ReactNode;
}

export function WatchlistDrawer({ children }: WatchlistDrawerProps) {
  const { watchlist, removeMovie } = useWatchlist();

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-zinc-950 border-t border-white/10 max-h-[90dvh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="flex items-center justify-between pb-4">
            <div>
              <DrawerTitle className="text-2xl font-bold text-white">
                La tua Watchlist
              </DrawerTitle>
              <DrawerDescription className="text-zinc-400">
                {watchlist.length} film salvati
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
                <button className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition">
                    <X size={20} />
                </button>
            </DrawerClose>
          </DrawerHeader>
          
          <ScrollArea className="h-[60vh] px-4 pb-8">
            {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-2">
                    <p>La tua lista è vuota</p>
                    <p className="text-sm">Swipe a destra per aggiungere film!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                {watchlist.map((movie) => (
                    <div key={movie.id} className="relative group aspect-2/3 rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                        <Image
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : "/placeholder-movie.jpg"}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 450px) 50vw, 200px"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                            <button 
                                onClick={() => removeMovie(movie.id)}
                                className="self-end p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition backdrop-blur-sm"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            )}
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
