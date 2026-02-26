import api from "../../services/axios";

export const fetchMoviesAPI = () => api.get("/movies");
