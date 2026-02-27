// frontend/src/types/movie.ts

export interface Movie {
  _id?: string;
  id?: string;
  title: string;
  posterUrl?: string;
  rating?: number;
  language?: string;
  duration?: number;
  status?: "NOW_SHOWING" | "UPCOMING";
  description?: string;
  releaseDate?: string;
  genre?: string;
  director?: string;
  trailer?: string;
  cast?: {
    name: string;
    role: string;
    image?: string;
  }[];
}