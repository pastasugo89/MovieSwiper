import { getDiscoverMovies } from "@/app/actions/movies";
import { Video, SlidersHorizontal } from "lucide-react";
import { CardStack } from "@/components/features/CardStack";

export default async function Home() {
  // Randomize start page to simulate "shuffling" the deck on refresh
  const startPage = Math.floor(Math.random() * 50) + 1;
  const movies = await getDiscoverMovies(startPage);
  console.log(`Movies fetched from page ${startPage}:`, movies.results.slice(0, 3).map(m => m.title));

  return (
    <div className="flex flex-col h-full w-full">
      {/* Minimalist Header */}
      <header className="flex items-center justify-between px-6 py-4 z-10 shrink-0">
        <div className="flex items-center gap-2 text-primary">
            <Video size={24} className="fill-current" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">MovieSwiper</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground">
            <SlidersHorizontal size={20} />
        </button>
      </header>

      {/* CardStackContainer - Flexible area occupying all available space */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center p-4">
        {/* Card Stack System */}
        <CardStack initialMovies={movies.results} startPage={startPage} />
      </div>
      
      {/* Spacer for Dock */}
      <div className="h-24 shrink-0" />
    </div>
  );
}
