//frontend/src/features/booking/bookingAPI.ts
import api from "../../services/axios";

export const lockSeatsAPI = (data: {
  showId: string;
  seats: string[];
}) => api.post("/booking/lock", data);

export const unlockSeatsAPI = (data: {
  showId: string;
  seats: string[];
}) => api.post("/booking/unlock", data);

export const getLockedSeatsAPI = (showId: string) =>
  api.get(`/booking/locked/${showId}`);
