const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

export async function fetchTMDB<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const token = process.env.NEXT_PUBLIC_TMDB_READ_KEY;

  if (!token) {
    throw new Error("TMDB Read Access Token is missing in environment variables.");
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  
  // Default params
  url.searchParams.append("language", "it-IT");
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    console.error(`TMDB API Error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
  }

  return response.json();
}

export function getTMDBImageUrl(
  path: string | null,
  size: "poster" | "backdrop" | "original" = "poster"
): string {
  if (!path) {
    return "/placeholder-image.jpg"; // You might want to create a real placeholder
  }

  if (size === "original") {
    return `${TMDB_BACKDROP_BASE_URL}${path}`;
  }
  
  // You can adjust sizes based on need, here using w500 for everything else
  return `${TMDB_IMAGE_BASE_URL}${path}`;
}
