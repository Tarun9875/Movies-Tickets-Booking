// backend/src/middlewares/auth/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwt";
import User from "../../models/User.model";

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
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const token = authHeader.split(" ")[1];

    /* ================= VERIFY TOKEN ================= */
    const decoded: any = verifyAccessToken(token);

    const userId = decoded?.id || decoded?._id || decoded?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    /* ================= OPTIONAL USER CHECK ================= */
    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(401).json({
        message: "User not found",
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