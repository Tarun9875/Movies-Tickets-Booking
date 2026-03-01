// backend/src/models/User.model.ts

import mongoose, { Schema, Document } from "mongoose";

/* =====================================
   USER INTERFACE
===================================== */

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  picture?: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  provider: "local" | "google";
  createdAt: Date;
  updatedAt: Date;
}

/* =====================================
   USER SCHEMA
===================================== */

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,       // ✅ This already creates index
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    picture: {
      type: String,
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================
   EXPORT MODEL
===================================== */

export default mongoose.model<IUser>("User", userSchema);