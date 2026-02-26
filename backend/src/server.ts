// src/server.ts
import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import http from "http";
import app from "./app"; // ✅ IMPORTANT (.js for NodeNext)
import { connectDB } from "./config/database";
import { initSocket } from "./sockets/index";

// Environment
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// 🔥 Initialize Socket.io
initSocket(server);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
