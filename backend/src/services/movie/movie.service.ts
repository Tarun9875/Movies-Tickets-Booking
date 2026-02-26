//backend/src/services/movie/movie.service.ts
import Movie from "../../models/Movie.model";

export const getAllMovies = async () => {
  return Movie.find().sort({ createdAt: -1 });
};

export const getMovieById = async (id: string) => {
  return Movie.findById(id);
};
