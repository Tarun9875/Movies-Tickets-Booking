// backend/src/middlewares/auth/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwt";
import User from "../../models/User.model";

/* =====================================================
   AUTH PROTECT MIDDLEWARE
===================================================== */

export const protect = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    /* ================= HEADER CHECK ================= */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token",
      });
    }

    const token = authHeader.split(" ")[1];

    /* ================= VERIFY TOKEN ================= */
    const decoded: any = verifyAccessToken(token);

    const userId =
      decoded?.id || decoded?._id || decoded?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    /* ================= CHECK USER EXISTS ================= */
    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    /* ================= ATTACH USER ================= */
    req.user = {
      id: userExists._id.toString(),
      role: userExists.role,
      email: userExists.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};