import { Movie } from "@/types/tmdb";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : "/placeholder-movie.jpg"; // Fallback image if needed

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 select-none">
      <Image
        src={imageUrl}
        alt={movie.title}
        fill
        className="object-cover pointer-events-none"
        priority={priority}
        sizes="(max-width: 450px) 100vw, 450px"
        draggable={false}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1 z-10 pointer-events-none">
        <h2 className="text-2xl font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
          {movie.title}
        </h2>
        <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
          {movie.release_date && (
            <span>{new Date(movie.release_date).getFullYear()}</span>
          )}
          {movie.vote_average > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-zinc-500" />
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
