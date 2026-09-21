import React from "react";
import { useAiPersonalization, AI_PERSONAS } from "../context/AiPersonalizationContext";

const AiPersonalizationModal = () => {
  const {
    activePersona,
    manualSetPersona,
    isAiModalOpen,
    setIsAiModalOpen,
    behavior,
    resetAiPreferences,
  } = useAiPersonalization();

  if (!isAiModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div
          className="p-6 text-white transition-colors duration-500"
          style={{ backgroundColor: activePersona.accentColor }}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md tracking-wide uppercase">
                ✨ Live AI Personalization
              </span>
              <h3 className="text-2xl font-bold mt-2 tracking-tight">
                {activePersona.name}
              </h3>
              <p className="text-sm text-white/80 mt-1 font-light">
                {activePersona.vibe}
              </p>
            </div>
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* AI Insights & Metrics */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Behavioral Insights
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-gray-200/60 shadow-xs">
                <span className="block text-gray-400">Total Interactions</span>
                <span className="text-base font-bold text-gray-800">
                  {behavior.clickCount || 0}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200/60 shadow-xs">
                <span className="block text-gray-400">Men's / Women's</span>
                <span className="text-base font-bold text-gray-800">
                  {behavior.categories["Men"] || 0} / {behavior.categories["Women"] || 0}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200/60 shadow-xs">
                <span className="block text-gray-400">AI Confidence</span>
                <span className="text-base font-bold text-teal-600">
                  {Math.min(99, 75 + Math.min((behavior.clickCount || 0) * 3, 24))}%
                </span>
              </div>
            </div>
          </div>

          {/* Persona Switcher */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Choose or Preview Aesthetic Style
              </h4>
              <span className="text-xs text-gray-400">Real-time theme adaptation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(AI_PERSONAS).map(([key, persona]) => {
                const isActive = activePersona.id === persona.id;
                return (
                  <button
                    key={key}
                    onClick={() => manualSetPersona(key)}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative ${
                      isActive
                        ? "border-2 shadow-md bg-gray-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                    style={{
                      borderColor: isActive ? persona.accentColor : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {persona.name}
                      </span>
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: persona.accentColor }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {persona.vibe}
                    </p>
                    {isActive && (
                      <span
                        className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md text-white"
                        style={{ backgroundColor: persona.accentColor }}
                      >
                        Active Style
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanatory Note */}
          <div className="text-xs text-gray-500 leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <span className="font-semibold text-amber-900">💡 How AI works here:</span>{" "}
            As you browse products and categories, our neural recommendation and styling engine
            adapts product scoring, styling accents, and curated picks to your taste.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={resetAiPreferences}
            className="text-xs text-gray-500 hover:text-red-600 transition underline underline-offset-2"
          >
            Reset Learning
          </button>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="px-5 py-2 text-xs font-semibold rounded-lg text-white shadow-sm transition hover:opacity-90 active:scale-95"
            style={{ backgroundColor: activePersona.accentColor }}
          >
            Apply & Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPersonalizationModal;
