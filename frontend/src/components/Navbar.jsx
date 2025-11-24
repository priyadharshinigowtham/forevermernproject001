import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/shopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const { setShowSearch, getCartCount } = useContext(ShopContext);

  // Function to determine the NavLink class based on active state
  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 ${
      isActive ? 'text-black' : 'text-gray-700'
    }`;

  // Function to conditionally render the underline for the active link
  const navUnderline = ({ isActive }) =>
    `w-2/4 border-none h-[1.5px] ${
      isActive ? 'bg-black' : 'bg-gray-700'
    }`;

  return (
    <div className='flex items-center justify-between py-4 font-medium'>
      <Link to='/'>
        <img src={assets.logo} className='w-36' alt='Company Logo' />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm'>
        <NavLink to='/' className={navLinkClass}>
          <p>HOME</p>
          <hr className={navUnderline} />
        </NavLink>
        <NavLink to='/collection' className={navLinkClass}>
          <p>COLLECTION</p>
          <hr className={navUnderline} />
        </NavLink>
        <NavLink to='/about' className={navLinkClass}>
          <p>ABOUT</p>
          <hr className={navUnderline} />
        </NavLink>
        <NavLink to='/contact' className={navLinkClass}>
          <p>CONTACT</p>
          <hr className={navUnderline} />
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className='w-4 cursor-pointer'
          alt='Search'
        />

        <div className='relative group'>
          <Link to='/login'>
            <img
              src={assets.profile_icon}
              className='w-4 cursor-pointer'
              alt='Profile/Account'
            />
          </Link>
          <div className='hidden group-hover:block absolute right-0 pt-4 z-10'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-md'>
              <Link to='/profile' className='cursor-pointer hover:text-black'>
                My Profile
              </Link>
              <Link to='/orders' className='cursor-pointer hover:text-black'>
                Orders
              </Link>
              <p className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt='Shopping Cart' />
          <p className='absolute bottom-[-5px] right-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt='Menu'
        />
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300 ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className='flex flex-col text-gray-600'>
          <div
            onClick={() => setVisible(false)}
            className='flex items-center gap-4 p-3 cursor-pointer border-b'
          >
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt='Close Menu' />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) => `py-3 pl-6 border ${isActive ? 'bg-gray-100 text-black font-semibold' : ''}`}
            to='/'
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) => `py-3 pl-6 border ${isActive ? 'bg-gray-100 text-black font-semibold' : ''}`}
            to='/collection'
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) => `py-3 pl-6 border ${isActive ? 'bg-gray-100 text-black font-semibold' : ''}`}
            to='/about'
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) => `py-3 pl-6 border ${isActive ? 'bg-gray-100 text-black font-semibold' : ''}`}
            to='/contact'
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;