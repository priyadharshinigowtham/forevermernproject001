import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "./ShopContext";

export const AiPersonalizationContext = createContext();

// Pre-defined stylish AI Personas
export const AI_PERSONAS = {
  MINIMALIST: {
    id: "minimalist",
    name: "Modern Minimalist",
    vibe: "Clean, Monochromatic & Contemporary",
    categoryAffinity: "General",
    accentColor: "#18181b", // zinc-900
    accentLight: "#f4f4f5",
    accentBadge: "#27272a",
    textColor: "#09090b",
    heroGreeting: "Curated Minimalism For The Discerning Wardrobe",
    heroSubtext: "AI-calibrated essentials crafted with clean silhouettes and neutral tones.",
    tag: "Minimalist Edit",
  },
  URBAN: {
    id: "urban",
    name: "Urban Trendsetter",
    vibe: "Streetwear, Utility & Modern Tailoring",
    categoryAffinity: "Men",
    accentColor: "#0f766e", // teal-700
    accentLight: "#f0fdfa",
    accentBadge: "#115e59",
    textColor: "#134e4a",
    heroGreeting: "Elevated Streetwear & High-Performance Silhouettes",
    heroSubtext: "AI tailored picks inspired by your passion for modern urban essentials.",
    tag: "Urban Selection",
  },
  CHIC: {
    id: "chic",
    name: "Chic Contemporary",
    vibe: "Elegant, Runway-Inspired & Timeless",
    categoryAffinity: "Women",
    accentColor: "#be185d", // pink-700
    accentLight: "#fdf2f8",
    accentBadge: "#9d174d",
    textColor: "#831843",
    heroGreeting: "Effortless Elegance & Statement Silhouettes",
    heroSubtext: "AI handpicked dresses, outerwear, and accessories tuned to your refined aesthetic.",
    tag: "Chic Spotlight",
  },
  LUXE: {
    id: "luxe",
    name: "Midnight Luxe",
    vibe: "Premium, Sophisticated & High-End",
    categoryAffinity: "Premium",
    accentColor: "#4338ca", // indigo-700
    accentLight: "#eef2ff",
    accentBadge: "#3730a3",
    textColor: "#312e81",
    heroGreeting: "Exclusive Designer Cuts & Luxurious Textures",
    heroSubtext: "AI detected an affinity for premium quality and sophisticated craftsmanship.",
    tag: "Luxe Tier",
  },
};

const STORAGE_KEY_BEHAVIOR = "ai_user_behavior_v1";
const STORAGE_KEY_PERSONA = "ai_selected_persona_v1";

export const AiPersonalizationProvider = ({ children }) => {
  const { backendUrl } = useContext(ShopContext) || {};
  const [behavior, setBehavior] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BEHAVIOR);
      return saved
        ? JSON.parse(saved)
        : {
            categories: { Men: 0, Women: 0, Kids: 0 },
            subCategories: {},
            viewedProducts: [],
            pricePoints: [],
            clickCount: 0,
          };
    } catch {
      return {
        categories: { Men: 0, Women: 0, Kids: 0 },
        subCategories: {},
        viewedProducts: [],
        pricePoints: [],
        clickCount: 0,
      };
    }
  });

  const [activePersona, setActivePersona] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERSONA);
      if (saved && AI_PERSONAS[saved]) return AI_PERSONAS[saved];
    } catch {}
    return AI_PERSONAS.MINIMALIST;
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Save behavior to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BEHAVIOR, JSON.stringify(behavior));
    } catch (e) {
      console.warn("Could not save AI behavior", e);
    }
  }, [behavior]);

  // Save persona preference
  useEffect(() => {
    try {
      const key = Object.keys(AI_PERSONAS).find(
        (k) => AI_PERSONAS[k].id === activePersona.id
      );
      if (key) localStorage.setItem(STORAGE_KEY_PERSONA, key);
    } catch {}
  }, [activePersona]);

  // Log user activity (product view, category click, cart add)
  const trackInteraction = ({ type, category, subCategory, productId, price }) => {
    setBehavior((prev) => {
      const updated = { ...prev };
      updated.clickCount = (updated.clickCount || 0) + 1;

      if (category) {
        updated.categories[category] = (updated.categories[category] || 0) + 1;
      }
      if (subCategory) {
        updated.subCategories[subCategory] =
          (updated.subCategories[subCategory] || 0) + 1;
      }
      if (productId && !updated.viewedProducts.includes(productId)) {
        updated.viewedProducts = [productId, ...updated.viewedProducts].slice(0, 20);
      }
      if (price) {
        updated.pricePoints = [...(updated.pricePoints || []), Number(price)].slice(-15);
      }

      // Automatically recalculate optimal persona if not manually overridden recently
      const menViews = updated.categories["Men"] || 0;
      const womenViews = updated.categories["Women"] || 0;
      const avgPrice =
        updated.pricePoints.length > 0
          ? updated.pricePoints.reduce((a, b) => a + b, 0) /
            updated.pricePoints.length
          : 0;

      if (avgPrice > 150) {
        setActivePersona(AI_PERSONAS.LUXE);
      } else if (womenViews > menViews && womenViews >= 2) {
        setActivePersona(AI_PERSONAS.CHIC);
      } else if (menViews > womenViews && menViews >= 2) {
        setActivePersona(AI_PERSONAS.URBAN);
      }

      return updated;
    });

    // Optionally ping backend
    if (backendUrl) {
      axios
        .post(`${backendUrl}/ai/personalize`, {
          viewedCategories: behavior.categories,
          viewedSubCategories: behavior.subCategories,
          clickCount: behavior.clickCount,
        })
        .catch(() => {});
    }
  };

  const manualSetPersona = (personaKey) => {
    if (AI_PERSONAS[personaKey]) {
      setActivePersona(AI_PERSONAS[personaKey]);
    }
  };

  const resetAiPreferences = () => {
    const empty = {
      categories: { Men: 0, Women: 0, Kids: 0 },
      subCategories: {},
      viewedProducts: [],
      pricePoints: [],
      clickCount: 0,
    };
    setBehavior(empty);
    setActivePersona(AI_PERSONAS.MINIMALIST);
    localStorage.removeItem(STORAGE_KEY_BEHAVIOR);
    localStorage.removeItem(STORAGE_KEY_PERSONA);
  };

  return (
    <AiPersonalizationContext.Provider
      value={{
        activePersona,
        manualSetPersona,
        trackInteraction,
        behavior,
        resetAiPreferences,
        isAiModalOpen,
        setIsAiModalOpen,
        AI_PERSONAS,
      }}
    >
      {children}
    </AiPersonalizationContext.Provider>
  );
};

export const useAiPersonalization = () => {
  const context = useContext(AiPersonalizationContext);
  if (!context) {
    throw new Error(
      "useAiPersonalization must be used within an AiPersonalizationProvider"
    );
  }
  return context;
};
