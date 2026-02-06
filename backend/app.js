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
const corsOptions = {
  origin: function (origin, callback) {
    // Allow ALL origins to resolve Vercel alias mismatches
    // This effectively disables CORS protection for debugging
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Enable pre-flight for all routes using regex to avoid parsing errors

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
