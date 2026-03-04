import { Request, Response } from "express";
import Settings from "../../models/Settings.model";

/* ================= GET SETTINGS ================= */

export const getSettings = async (req: Request, res: Response) => {
  try {

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);

  } catch (error) {
    console.error("Settings fetch error:", error);
    res.status(500).json({ message: "Failed to load settings" });
  }
};

/* ================= UPDATE SETTINGS ================= */

export const updateSettings = async (req: Request, res: Response) => {
  try {

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

    res.json({
      message: "Settings updated successfully",
      settings,
    });

  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
};