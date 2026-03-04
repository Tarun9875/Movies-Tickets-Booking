import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
{
  theatreName: {
    type: String,
    default: "Ruchu Cinemas",
  },

  theatreLocation: {
    type: String,
    default: "Surat",
  },

  vipPrice: {
    type: Number,
    default: 500,
  },

  premiumPrice: {
    type: Number,
    default: 250,
  },

  executivePrice: {
    type: Number,
    default: 230,
  },

  normalPrice: {
    type: Number,
    default: 210,
  },

  bookingTimeLimit: {
    type: Number,
    default: 5,
  },

  maintenanceMode: {
    type: Boolean,
    default: false,
  },

  currency: {
    type: String,
    default: "INR",
  },
},
{ timestamps: true }
);

export default mongoose.model("Settings", SettingsSchema);