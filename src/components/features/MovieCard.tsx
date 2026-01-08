import { Movie } from "@/types/tmdb";
import Image from "next/image";
import { MotionValue, useTransform, motion, useMotionValue, PanInfo } from "framer-motion";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  active?: boolean;
  onSwipe?: (direction: "left" | "right") => void;
}

export function MovieCard({ movie, active = false, onSwipe }: MovieCardProps) {
  const [exitX, setExitX] = useState<number | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : "/placeholder-movie.jpg";

  // Map x to opacity for feedback overlays
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 150) {
        setExitX(200);
        onSwipe?.("right");
    } else if (info.offset.x < -150) {
        setExitX(-200);
        onSwipe?.("left");
    }
  };

  return (
    <motion.div
      className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 select-none cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      exit={exitX ? { x: exitX, opacity: 0, transition: { duration: 0.2 } } : undefined}
    >
      <Image
        src={imageUrl}
        alt={movie.title}
        fill
        className="object-cover pointer-events-none"
        priority={active}
        sizes="(max-width: 450px) 100vw, 450px"
        draggable={false}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Feedback Overlays */}
      <motion.div 
          style={{ opacity: likeOpacity }}
          className="absolute inset-0 bg-green-500/30 flex items-center justify-center z-20 pointer-events-none"
      >
          <div className="border-4 border-green-400 text-green-400 font-extrabold text-4xl px-4 py-2 rounded-xl -rotate-12 bg-black/20 backdrop-blur-sm">
              LIKE
          </div>
      </motion.div>

      <motion.div 
          style={{ opacity: nopeOpacity }}
          className="absolute inset-0 bg-red-500/30 flex items-center justify-center z-20 pointer-events-none"
      >
          <div className="border-4 border-red-500 text-red-500 font-extrabold text-4xl px-4 py-2 rounded-xl rotate-12 bg-black/20 backdrop-blur-sm">
              NOPE
          </div>
      </motion.div>

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
    </motion.div>
  );
}
