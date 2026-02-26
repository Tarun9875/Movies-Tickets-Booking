//backend/src/services/booking/seatLock.service.ts
import redis from "../../config/redis";

export type LockedSeatMap = Record<string, string>;

const LOCK_TTL = 300; // 5 minutes

export const lockSeats = async (
  showId: string,
  seats: string[],
  userId: string
) => {
  const key = `seat-lock:${showId}`;

  const redisResult = await redis.hgetall(key);
  const lockedSeats = (redisResult ?? {}) as LockedSeatMap;

  for (const seat of seats) {
    if (lockedSeats[seat] && lockedSeats[seat] !== userId) {
      throw new Error(`Seat ${seat} already locked`);
    }
  }

  const multi = redis.multi();
  seats.forEach((seat) => {
    multi.hset(key, seat, userId);
  });

  multi.expire(key, LOCK_TTL);
  await multi.exec();
};

export const unlockSeats = async (
  showId: string,
  seats: string[],
  userId: string
) => {
  const key = `seat-lock:${showId}`;

  const redisResult = await redis.hgetall(key);
  const lockedSeats = (redisResult ?? {}) as LockedSeatMap;

  const multi = redis.multi();
  seats.forEach((seat) => {
    if (lockedSeats[seat] === userId) {
      multi.hdel(key, seat);
    }
  });

  await multi.exec();
};

export const getLockedSeats = async (
  showId: string
): Promise<LockedSeatMap> => {
  const key = `seat-lock:${showId}`;
  const redisResult = await redis.hgetall(key);
  return (redisResult ?? {}) as LockedSeatMap;
};
