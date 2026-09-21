import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { useAiPersonalization } from "../context/AiPersonalizationContext";

const AiRecommendations = ({
  productId,
  category,
  subCategory,
  title = "AI Smart Recommendations",
  subtitle = "Personalized selections powered by our neural style and preference engine",
  limit = 8,
}) => {
  const { products, currency, backendUrl } = useContext(ShopContext);
  const { activePersona, trackInteraction, behavior } = useAiPersonalization();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        if (backendUrl) {
          const params = new URLSearchParams();
          if (productId) params.append("productId", productId);
          if (category) params.append("category", category);
          if (subCategory) params.append("subCategory", subCategory);
          params.append("limit", limit.toString());

          // Pass user interests from personalization context
          if (behavior.viewedProducts?.length) {
            params.append("viewedIds", JSON.stringify(behavior.viewedProducts));
          }

          const response = await axios.get(
            `${backendUrl}/ai/recommendations?${params.toString()}`
          );
          if (response.data.success && isMounted) {
            setRecommendations(response.data.recommendations);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Falling back to client-side AI recommendation scorer", err);
      }

      // Client-side fallback scorer if backend is delayed or loading
      if (products && products.length > 0 && isMounted) {
        const currentTarget = productId
          ? products.find((p) => p._id === productId)
          : null;

        const scored = products
          .filter((p) => !currentTarget || p._id !== currentTarget._id)
          .map((p, idx) => {
            let score = 75;
            let reason = "Curated based on trending styles";

            if (currentTarget) {
              if (p.category === currentTarget.category) {
                score += 15;
                reason = `Matches ${p.category} collection`;
              }
              if (p.subCategory === currentTarget.subCategory) {
                score += 8;
                reason = `Complements ${p.subCategory}`;
              }
            } else if (activePersona.categoryAffinity === p.category) {
              score += 20;
              reason = `Aligned with your ${activePersona.name} style`;
            }

            if (p.bestseller) score += 6;
            const finalScore = Math.min(99, score + (idx % 4));

            return {
              ...p,
              aiMatchScore: finalScore,
              aiReason: reason,
              aiTag: finalScore >= 92 ? "Top AI Match" : "Recommended",
            };
          })
          .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
          .slice(0, limit);

        setRecommendations(scored);
      }
      if (isMounted) setLoading(false);
    };

    fetchRecommendations();
    return () => {
      isMounted = false;
    };
  }, [productId, category, subCategory, products, limit, activePersona, backendUrl]);

  const filteredItems = recommendations.filter((item) => {
    if (activeFilter === "high_match") return item.aiMatchScore >= 90;
    if (activeFilter === "bestseller") return !!item.bestseller;
    return true;
  });

  if (!loading && recommendations.length === 0) return null;

  return (
    <div className="my-16 relative">
      {/* Header with AI Badge & Persona Styling */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200/80 mb-3 shadow-xs">
          <span className="text-amber-500 animate-pulse">✨</span>
          <span>AI Neural Recommendation Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="w-3/4 m-auto text-xs sm:text-sm text-gray-500 mt-2 font-normal">
          {subtitle}
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition ${
              activeFilter === "all"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All AI Picks ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveFilter("high_match")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition ${
              activeFilter === "high_match"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ⭐ Top Affinity (90%+)
          </button>
          <button
            onClick={() => setActiveFilter("bestseller")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition ${
              activeFilter === "bestseller"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🔥 Trending & Bestsellers
          </button>
        </div>
      </div>

      {/* Grid of Recommended Products */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse rounded-xl h-72 border border-gray-200"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-8">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group relative flex flex-col bg-white rounded-xl p-2.5 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image & Match Score Overlay */}
              <Link
                to={`/product/${item._id}`}
                onClick={() => {
                  trackInteraction({
                    type: "product_click",
                    category: item.category,
                    subCategory: item.subCategory,
                    productId: item._id,
                    price: item.price,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative overflow-hidden rounded-lg aspect-3/4 bg-gray-50 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={item.image?.[0]}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Match Score Badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/75 backdrop-blur-md shadow-xs flex items-center gap-1">
                    <span className="text-amber-400">✨</span>
                    {item.aiMatchScore}% Match
                  </span>
                </div>

                {item.bestseller && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-amber-900 bg-amber-200/90 backdrop-blur-md shadow-xs">
                    Bestseller
                  </span>
                )}
              </Link>

              {/* Product Info & AI Reasoning */}
              <div className="pt-3 pb-1 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50 inline-block px-1.5 py-0.5 rounded mb-1 truncate max-w-full">
                    {item.aiReason || "AI Stylist Pick"}
                  </div>
                  <Link
                    to={`/product/${item._id}`}
                    onClick={() => {
                      trackInteraction({
                        type: "product_click",
                        category: item.category,
                        subCategory: item.subCategory,
                        productId: item._id,
                        price: item.price,
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-black">
                      {item.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-900">
                    {currency}
                    {item.price}
                  </p>
                  <span className="text-[11px] text-gray-400 uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiRecommendations;
