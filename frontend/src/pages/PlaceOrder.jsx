import React from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // 1. IMPORT useNavigate

const PlaceOrder = () => {
  
  // Set initial state to 'cod' to match the selected option in the latest image.
  const [method,setMethod]= useState('cod')
  // 2. INITIALIZE useNavigate
  const navigate = useNavigate();

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-10 pt-10 min-h-[80vh] border-t'>

      {/* LEFT SIDE (DELIVERY INFORMATION) */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl mt-2'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-2 px-4 w-full' type="text" placeholder='First name' />
          <input className='border border-gray-300 rounded py-2 px-4 w-full' type="text" placeholder='Last name' />
        </div>

        <input className='border border-gray-300 rounded py-2 px-4 w-full' type="text" placeholder='Email address' />
        <input className='border border-gray-300 rounded py-2 px-4 w-full' type="text" placeholder='Street' />

        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-2 px-4 w-full' type="text" placeholder='City' />
          <input className='border border-gray-300 rounded py-2 px-4 w-full' type="text" placeholder='State' />
        </div>

        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-2 px-4 w-full' type="number" placeholder='Zipcode' />
          <input className='border border-gray-300 rounded py-2 px-4 w-full' type="text" placeholder='Country' />
        </div>

        <input className='border border-gray-300 rounded py-2 px-4 w-full' type="number" placeholder='Phone' />

      </div>


      {/* RIGHT SIDE (CART TOTALS & PAYMENT METHOD) */}
      <div className='w-full sm:w-[420px] mt-10 sm:mt-0'>

        <CartTotal />

        <div className='mt-10'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          
          {/* Payment method selection */}
          <div className='flex gap-3 mt-4 flex-col lg:flex-row'>
            
            {/* Stripe */}
            <div onClick={()=>setMethod('stripe')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'stripe' ? 'border-green-400' : ''}`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe Logo" />
            </div>

            <div onClick={()=>setMethod('razorpay')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'razorpay' ? 'border-green-400' : ''}`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="Razorpay Logo" />
            </div>
            
            <div onClick={()=>setMethod('cod')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'cod' ? 'border-green-400' : ''}`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
            
          </div>

          <div className='w-full text-end mt-8'>
            {/* PLACE ORDER BUTTON - uses the 'navigate' function */}
            <button onClick={()=> navigate('/Orders')}className='bg-black text-white text-sm my-8 px-8 py-3'>Place Order</button>
          </div>
          
        </div>

      </div>

    </div>
  )
}

export default PlaceOrder