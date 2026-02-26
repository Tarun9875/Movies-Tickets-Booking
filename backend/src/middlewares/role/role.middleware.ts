//backend/src/middlewares/role/role.middleware.ts
import { Response, NextFunction } from "express";
import { Request } from "express";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const roleMiddleware =
  (allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Access denied"
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };
