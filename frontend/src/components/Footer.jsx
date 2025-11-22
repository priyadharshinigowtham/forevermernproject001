import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-14 my-10 mt-40 text-sm">

        <div className="sm:w-1/3">
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Where style meets simplicity. Shop the looks you love, made just for you.
          </p>
        </div>

        <div className="sm:w-1/3">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>HOME</li>
            <li>ABOUT US</li>
            <li>DELIVERY</li>
            <li>PRIVACY POLICY</li>
          </ul>
        </div>

        <div className="sm:w-1/3">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91-9171888298</li>
            <li>contact@forever@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 @ forever.com - All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
