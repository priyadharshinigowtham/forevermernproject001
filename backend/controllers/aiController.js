import {
  getSmartRecommendations,
  computeUserPersonalization,
  calculateDemandForecast,
} from "../services/aiService.js";

// GET AI-POWERED RECOMMENDATIONS
export const getAiRecommendations = async (req, res) => {
  try {
    const { productId, category, subCategory, limit, viewedIds } = req.query;

    let userInterests = [];
    if (req.query.interests) {
      try {
        userInterests = JSON.parse(req.query.interests);
      } catch {
        userInterests = [req.query.interests];
      }
    }

    let viewedProductIds = [];
    if (viewedIds) {
      try {
        viewedProductIds = JSON.parse(viewedIds);
      } catch {
        viewedProductIds = [viewedIds];
      }
    }

    const recommendations = await getSmartRecommendations({
      productId,
      category,
      subCategory,
      userInterests,
      viewedProductIds,
      limit: limit ? Number(limit) : 8,
    });

    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST USER BEHAVIOR FOR AI PERSONALIZATION
export const getAiPersonalization = async (req, res) => {
  try {
    const {
      userId,
      viewedCategories = {},
      viewedSubCategories = {},
      avgPriceViewed = 0,
      clickCount = 0,
      timeSpentMinutes = 0,
    } = req.body;

    const personalization = await computeUserPersonalization({
      userId,
      viewedCategories,
      viewedSubCategories,
      avgPriceViewed,
      clickCount,
      timeSpentMinutes,
    });

    res.json({
      success: true,
      personalization,
    });
  } catch (error) {
    console.error("AI Personalization Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// GET AI INVENTORY DEMAND FORECAST (ADMIN)
export const getAiDemandForecast = async (req, res) => {
  try {
    const leadTimeDays = Number(req.query.leadTimeDays) || 7;
    const daysToForecast = Number(req.query.daysToForecast) || 30;

    const forecastData = await calculateDemandForecast({
      leadTimeDays,
      daysToForecast,
    });

    res.json({
      success: true,
      ...forecastData,
    });
  } catch (error) {
    console.error("AI Demand Forecast Error:", error);
    res.json({ success: false, message: error.message });
  }
};
