// src/app.ts
import express from "express";
import cors from "cors";
import corsOptions from "./config/cors";
import routes from "./routes/index";/* 
import "express-async-errors"; // To handle async errors without try-catch */
import cookieParser from "cookie-parser";

const app = express();

app.use(cors(corsOptions)); // ✅ IMPORTANT
app.use(express.json());

app.use("/api", routes);

app.use(cookieParser());
/* app.use("/uploads", express.static("src/uploads")); */
/* ================= STATIC FILES ================= */
/*
This is REQUIRED for images to display
*/
app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => {
  res.send("Movie Booking Backend API is running 🚀");
});

export default app;
