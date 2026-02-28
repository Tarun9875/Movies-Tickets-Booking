// backend/src/utils/jwt.ts

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
/*                   TOKEN PAYLOAD                       */
/* ===================================================== */

export interface TokenPayload extends JwtPayload {
  id: string;
  role?: string;
}

/* ===================================================== */
/*                ACCESS TOKEN                           */
/* ===================================================== */

export const signAccessToken = (
  payload: { id: string; role?: string },
  expiresIn: SignOptions["expiresIn"] = "1d"
): string => {
  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
    },
    JWT_SECRET,
    { expiresIn }
  );
};

/* ===================================================== */
/*                REFRESH TOKEN                          */
/* ===================================================== */

export const signRefreshToken = (
  payload: { id: string; role?: string },
  expiresIn: SignOptions["expiresIn"] = "7d"
): string => {
  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
    },
    JWT_REFRESH_SECRET,
    { expiresIn }
  );
};

/* ===================================================== */
/*                   VERIFY TOKEN                        */
/* ===================================================== */

export const verifyAccessToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

  if (!decoded.id) {
    throw new Error("Invalid token payload");
  }

  return decoded;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;

  if (!decoded.id) {
    throw new Error("Invalid refresh token payload");
  }

  return decoded;
};