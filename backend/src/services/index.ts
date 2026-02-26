//backend/src/services/index.ts
import * as authService from "./auth/auth.service";
import * as movieService from "./movie/movie.service";
import * as seatLockService from "./booking/seatLock.service";
// later you can add more services here
// import * as movieService from "./movie/movie.service";
// import * as bookingService from "./booking/booking.service";

export {
  authService,
  movieService,
  seatLockService

};
