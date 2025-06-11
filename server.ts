// src/server.ts
import express from "express";
import mongoose from "mongoose";
import { Server } from "http";
import "dotenv/config";

import routes from "./routes/index";
import { setupMiddleware } from "./middleware";

const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
const port = 8000;

mongoose.connect(MONGO_URL);

const app = express();

// Setup middleware (CORS, JSON parsing, Swagger/OpenAPI, error handling, etc.)
setupMiddleware(app);

// Mount routes
app.use("/", routes);

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
