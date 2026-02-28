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
      unique: true,
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
   INDEX FOR PERFORMANCE
===================================== */

userSchema.index({ email: 1 });

export default mongoose.model<IUser>("User", userSchema);