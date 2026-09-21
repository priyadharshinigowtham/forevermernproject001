import express from "express";
import {
  getAiRecommendations,
  getAiPersonalization,
  getAiDemandForecast,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

// Public / shopper endpoints
aiRouter.get("/recommendations", getAiRecommendations);
aiRouter.post("/personalize", getAiPersonalization);

// Admin forecast endpoint
aiRouter.get("/forecast", getAiDemandForecast);

export default aiRouter;
