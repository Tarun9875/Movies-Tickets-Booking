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
    let token: string | undefined;

    /* ================= GET TOKEN ================= */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    /* ================= VERIFY TOKEN ================= */
    const decoded: any = verifyAccessToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    /* ================= CHECK USER EXISTS ================= */
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    /* ================= ATTACH USER TO REQUEST ================= */
    req.user = {
      id: user._id.toString(),
      role: user.role?.toUpperCase(), // 🔥 normalize role
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};