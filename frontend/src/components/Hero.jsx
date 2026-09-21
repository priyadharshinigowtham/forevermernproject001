import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { useAiPersonalization } from '../context/AiPersonalizationContext'

const Hero = () => {
  const { activePersona, setIsAiModalOpen } = useAiPersonalization();

  return (
    <div className='relative overflow-hidden flex flex-col sm:flex-row border border-gray-200 rounded-2xl shadow-xs transition-all duration-500 bg-white'>
      {/* Background ambient gradient glow tailored to persona */}
      <div 
        className='absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none transition-colors duration-700'
        style={{ backgroundColor: activePersona.accentColor }}
      />

      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-16 px-6 sm:px-12 relative z-10'>
        <div className='text-[#414141] max-w-md'>
          {/* AI Persona Pill */}
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100/90 text-gray-700 border border-gray-200/80 mb-4 hover:bg-gray-200/80 transition cursor-pointer'
          >
            <span className='animate-pulse'>✨</span>
            <span>AI Curated: {activePersona.name}</span>
            <span 
              className='w-2 h-2 rounded-full'
              style={{ backgroundColor: activePersona.accentColor }}
            />
          </button>

          <div className='flex items-center gap-2'>
            <p 
              className='w-8 md:w-11 h-[2px] transition-colors duration-500'
              style={{ backgroundColor: activePersona.accentColor }}
            />
            <p className='font-semibold text-xs md:text-sm tracking-wider uppercase text-gray-600'>
              {activePersona.tag}
            </p>
          </div>

          <h1 className='prata-regular text-3xl sm:text-4xl lg:text-5xl leading-tight my-3 text-gray-900'>
            {activePersona.name === "Modern Minimalist" ? "Latest Arrivals" : activePersona.name}
          </h1>

          <p className='text-xs sm:text-sm text-gray-500 mb-6 font-light leading-relaxed'>
            {activePersona.heroSubtext}
          </p>

          <div className='flex items-center gap-4'>
            <Link 
              to='/collection'
              className='px-6 py-3 rounded-lg text-white text-xs font-semibold tracking-wider transition-all duration-200 shadow-md hover:opacity-90 active:scale-95 flex items-center gap-2'
              style={{ backgroundColor: activePersona.accentColor }}
            >
              <span>EXPLORE LOOKS</span>
              <span>&rarr;</span>
            </Link>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className='text-xs font-semibold text-gray-600 hover:text-black transition flex items-center gap-1.5'
            >
              <span>Tune Vibe</span>
              <span className='text-[10px] text-gray-400'>[AI]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <div className='w-full sm:w-1/2 relative bg-gray-50 flex items-center justify-center overflow-hidden'>
        <img 
          className='w-full h-full object-cover max-h-[500px] hover:scale-105 transition-transform duration-700' 
          src={assets.hero_img} 
          alt="Fashion Hero Banner" 
        />
        {/* Subtle glassmorphism floating tag */}
        <div className='absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 shadow-xs flex items-center gap-2 text-xs font-medium text-gray-800'>
          <span className='w-2 h-2 rounded-full bg-emerald-500 animate-ping' />
          <span>New Season Drops</span>
        </div>
      </div>
    </div>
  )
}

export default Hero
