// src/server.ts
import "dotenv/config";     // ← this must be first!
import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.ts";
import { setupMiddleware } from "./middleware/index.ts";
import { Server } from "http";


const MONGO_URL = "mongodb://127.0.0.1:27017/health_tracker";
const port = 8000;

console.log("Connecting to MongoDB...");
mongoose.connect(MONGO_URL);

const app = express();

// Setup middleware (CORS, JSON parsing, Swagger/OpenAPI, error handling, etc.)
console.log("Setting up middleware...");
setupMiddleware(app);

// Mount routes
app.use("/", routes);

console.log("Starting server...");
const server: Server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

// Gracefully shutdown on SIGINT
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed.");
  });
  mongoose
    .disconnect()
    .then(() => {
      console.log("Database instance disconnected.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during disconnection:", err);
      process.exit(1);
    });
});
