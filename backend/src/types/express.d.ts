// backend/src/types/express.d.ts

import { IUser } from "../models/User.model";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: string;
        email?: string;
      };
    }
  }
}

export {};