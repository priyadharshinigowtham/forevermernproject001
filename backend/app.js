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

// middlewares
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://forevermernproject001-essk-k5b047r2j.vercel.app", // Your specific Admin URL
  "https://forevermernproject001-essk-k5b047r2j.vercel.app/",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || true) {
      // Temporarily allow ALL for debugging
      return callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes

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
