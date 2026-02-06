import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

// 1. Unified CORS & Preflight Handler (MUST BE FIRST)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow any origin during debugging/deployment phase
  res.header("Access-Control-Allow-Origin", origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,token,Origin,Accept",
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle pre-flight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// 2. Body Parser
app.use(express.json());

// DB connection
connectDB();

// routes
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

// health check
app.get("/health", (req, res) => {
  res.json({ message: "API Working" });
});

app.get("/", (req, res) => {
  res.send("API Working");
});

export default app;
