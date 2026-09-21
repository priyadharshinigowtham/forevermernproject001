import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    const aiSmartSuggestions = [
      { label: "Trending Topwear", query: "Topwear" },
      { label: "Summer Essentials", query: "Cotton" },
      { label: "Bestseller Styles", query: "Men" },
      { label: "Winter Layering", query: "Winterwear" },
      { label: "Chic Bottomwear", query: "Bottomwear" },
    ];

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);
    
  return showSearch && visible ? (
    <div className='border-t border-b bg-gradient-to-b from-gray-50 to-white text-center py-5 transition-all duration-300'>
      {/* Input Field */}
      <div className='inline-flex items-center justify-center border border-gray-300 px-5 py-2.5 mx-3 rounded-full w-4/5 sm:w-1/2 bg-white shadow-xs focus-within:border-black focus-within:ring-1 focus-within:ring-black/20 transition'>
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className='flex-1 outline-none bg-transparent text-sm text-gray-800 placeholder-gray-400' 
          type="text" 
          placeholder='AI Search: try "oversized shirts", "formal trousers", "winter"...'
        />
        {search ? (
          <button onClick={() => setSearch('')} className='text-xs text-gray-400 hover:text-gray-600 mr-2'>
            ✕
          </button>
        ) : null}
        <img className='w-4 cursor-pointer opacity-70' src={assets.search_icon} alt="Search" />
      </div>

      <img 
        onClick={() => setShowSearch(false)} 
        className='inline w-3.5 cursor-pointer ml-2 opacity-60 hover:opacity-100 transition' 
        src={assets.cross_icon} 
        alt="Close" 
      />

      {/* AI Smart Suggestion Chips */}
      <div className='flex flex-wrap items-center justify-center gap-2 mt-3 px-4'>
        <span className='text-[11px] font-semibold text-gray-400 flex items-center gap-1 mr-1'>
          <span>✨</span> AI Quick Picks:
        </span>
        {aiSmartSuggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSearch(item.query)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              search.toLowerCase() === item.query.toLowerCase()
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  ) : null;
}

export default SearchBar;
