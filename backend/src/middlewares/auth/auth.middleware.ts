// backend/src/middlewares/auth/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import redis from "../../config/redis";
import { verifyAccessToken } from "../../utils/jwt";

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    /* ================= HEADER CHECK ================= */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    /* ================= VERIFY TOKEN ================= */
    const decoded: any = verifyAccessToken(token);

    // 🔥 SAFELY EXTRACT USER ID
    const userId = decoded?.id || decoded?._id || decoded?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    /* ================= REDIS SESSION CHECK ================= */
    const redisToken = await redis.get(`auth:${userId}`);

    if (!redisToken || redisToken !== token) {
      return res.status(401).json({
        message: "Session expired",
      });
    }

    /* ================= ATTACH USER ================= */
    req.user = { id: userId };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};