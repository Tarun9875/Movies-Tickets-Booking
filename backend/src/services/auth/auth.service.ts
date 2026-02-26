//backend/src/services/auth/auth.service.ts
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import User from "../../models/User.model";
import redis from "../../config/redis";
import {
  signAccessToken,
  signRefreshToken
} from "../../utils/jwt";
import { logSuccess, logError } from "../../utils/logger";

/* ============================
   GOOGLE CLIENT
============================ */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ============================
   REGISTER USER
============================ */
export const registerUser = async (data: any) => {
  try {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      logError("Register failed: User already exists", data.email);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "USER",
      provider: "local"
    });

    logSuccess("User registered successfully", {
      userId: user._id.toString(),
      email: user.email
    });

    return user;
  } catch (error: any) {
    logError("Register error", error.message);
    throw error;
  }
};

/* ============================
   LOGIN USER
============================ */
export const loginUser = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      logError("Login failed: Invalid user", email);
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logError("Login failed: Password mismatch", email);
      throw new Error("Invalid credentials");
    }

    const accessToken = signAccessToken(
      { id: user._id.toString(), role: user.role },
      "1h"
    );

    const refreshToken = signRefreshToken(
      { id: user._id.toString(), role: user.role },
      "7d"
    );

    await redis.set(`auth:${user._id}`, accessToken, { EX: 3600 });

    logSuccess("User logged in successfully", {
      userId: user._id.toString(),
      redisKey: `auth:${user._id}`
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  } catch (error: any) {
    logError("Login error", error.message);
    throw error;
  }
};

/* ============================
   GOOGLE LOGIN / REGISTER
============================ */
export const googleLoginUser = async (googleToken: string) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid Google token");
    }

    const { email, name, picture } = payload;

    if (!email) {
      throw new Error("Google account email not found");
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        role: "USER",
        provider: "google"
      });

      logSuccess("Google user created", {
        userId: user._id.toString(),
        email: user.email
      });
    }

    const accessToken = signAccessToken(
      { id: user._id.toString(), role: user.role },
      "1h"
    );

    const refreshToken = signRefreshToken(
      { id: user._id.toString(), role: user.role },
      "7d"
    );

    await redis.set(`auth:${user._id}`, accessToken, { EX: 3600 });

    logSuccess("Google login successful", {
      userId: user._id.toString(),
      redisKey: `auth:${user._id}`
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture
      },
      accessToken,
      refreshToken
    };

  } catch (error: any) {
    logError("Google login error", error.message);
    throw error;
  }
};
