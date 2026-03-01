// backend/src/middlewares/auth/role.middleware.ts

import { Response, NextFunction } from "express";

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // normalize role to uppercase
  const userRole = req.user.role?.toUpperCase();

  if (userRole !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};