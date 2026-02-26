// utils/jwt.ts
import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

/* ===================================================== */
/*                     CONFIG                            */
/* ===================================================== */

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;
const JWT_REFRESH_SECRET: Secret =
  (process.env.JWT_REFRESH_SECRET as Secret) || JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/* ===================================================== */
/*                   TOKEN TYPES                         */
/* ===================================================== */

export interface TokenPayload extends JwtPayload {
  id: string;
  role?: string;
}

/* ===================================================== */
/*                ACCESS TOKEN                           */
/* ===================================================== */

export const signAccessToken = (
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "1h"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/* ===================================================== */
/*                REFRESH TOKEN                          */
/* ===================================================== */

export const signRefreshToken = (
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
};

/* ===================================================== */
/*                   VERIFY TOKEN                        */
/* ===================================================== */

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};
