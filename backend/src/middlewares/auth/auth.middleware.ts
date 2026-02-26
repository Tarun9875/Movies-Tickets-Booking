//backend/src/middlewares/auth/auth.middleware.ts
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

    // 🔹 Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // 🔹 Verify JWT (ACCESS TOKEN)
    const decoded = verifyAccessToken(token);

    // 🔹 Check Redis session
    const redisToken = await redis.get(`auth:${decoded.id}`);

    if (!redisToken || redisToken !== token) {
      return res.status(401).json({ message: "Session expired" });
    }

    // 🔹 Attach user to request
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
