"use server";

import { fetchTMDB } from "@/lib/tmdb";
import { MovieDetails, TMDBResponse, WatchProvidersResponse, Movie } from "@/types/tmdb";

export async function getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
  try {
    return await fetchTMDB<TMDBResponse<Movie>>("/movie/popular", {
      page: page.toString(),
    });
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

export async function getDiscoverMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
        const data = await fetchTMDB<TMDBResponse<Movie>>("/discover/movie", {
            page: page.toString(),
            watch_region: "IT",
            with_watch_providers: "8|119", // Netflix (8) OR Prime Video (119)
            with_watch_monetization_types: "flatrate",
            sort_by: "popularity.desc"
        });

        // Shuffle results to simulate randomness
        if (data.results && data.results.length > 0) {
            data.results = data.results.sort(() => Math.random() - 0.5);
        }

        return data;
    } catch (error) {
        console.error("Failed to discover movies:", error);
        return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
}

export async function getMovieDetails(mediaId: number): Promise<MovieDetails | null> {
  try {
    return await fetchTMDB<MovieDetails>(`/movie/${mediaId}`, {
      append_to_response: "credits,videos",
    });
  } catch (error) {
    console.error(`Failed to fetch details for movie ${mediaId}:`, error);
    return null;
  }
}

export async function getMovieWatchProviders(mediaId: number): Promise<WatchProvidersResponse | null> {
  try {
    return await fetchTMDB<WatchProvidersResponse>(`/movie/${mediaId}/watch/providers`);
  } catch (error) {
    console.error(`Failed to fetch watch providers for movie ${mediaId}:`, error);
    return null;
  }
}
