import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import AiRecommendations from '../components/AiRecommendations'
import { useAiPersonalization } from '../context/AiPersonalizationContext'

const Home = () => {
  const { activePersona, setIsAiModalOpen } = useAiPersonalization();

  return (
    <div>
      <Hero />

      {/* AI Personalization Notification Banner */}
      <div 
        onClick={() => setIsAiModalOpen(true)}
        className="mt-6 mb-2 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer transition-all duration-300 hover:shadow-md group"
        style={{
          background: `linear-gradient(135deg, ${activePersona.accentLight} 0%, #ffffff 100%)`,
          borderLeft: `4px solid ${activePersona.accentColor}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-sm"
            style={{ backgroundColor: activePersona.accentColor }}
          >
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                AI Powered Curation
              </span>
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: activePersona.accentColor }}
              >
                {activePersona.tag}
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-black">
              {activePersona.heroGreeting}
            </p>
          </div>
        </div>
        <button 
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs whitespace-nowrap"
        >
          Customize Style &rarr;
        </button>
      </div>

      {/* AI Intelligent Recommendations Section */}
      <AiRecommendations 
        title="AI Curated For You"
        subtitle={`Smart product matches personalized for your ${activePersona.name} style`}
        limit={8}
      />

      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
