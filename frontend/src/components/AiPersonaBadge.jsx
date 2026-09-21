import React from "react";
import { useAiPersonalization } from "../context/AiPersonalizationContext";

const AiPersonaBadge = () => {
  const { activePersona, setIsAiModalOpen } = useAiPersonalization();

  return (
    <button
      onClick={() => setIsAiModalOpen(true)}
      title="Click to view or adjust your AI shopping persona"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border border-white/20 backdrop-blur-md text-white transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: activePersona.accentColor,
        boxShadow: `0 10px 25px -5px ${activePersona.accentColor}66`,
      }}
    >
      <span className="text-base animate-bounce">✨</span>
      <div className="flex flex-col text-left text-xs leading-tight">
        <span className="text-[10px] uppercase font-bold tracking-wider text-white/75">
          AI Curated Style
        </span>
        <span className="font-semibold text-white truncate max-w-[130px]">
          {activePersona.name}
        </span>
      </div>
      <span className="ml-1 text-[10px] bg-white/20 rounded-full px-2 py-0.5 font-medium">
        Customize
      </span>
    </button>
  );
};

export default AiPersonaBadge;
