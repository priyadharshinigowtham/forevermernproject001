import React from 'react'
import Title from '../components/Title' 
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'



const About = () => { 
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />

      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]'src={assets.about_img} alt="About Us Image" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Welcome to Forever — where style meets simplicity. We believe fashion should be effortless, comfortable, and truly you. Our mission is to bring timeless designs, premium quality, and thoughtful details to your everyday wardrobe.</p>
        <p>What started as a small idea has grown into a space where style and simplicity come together.At Forever, we focus on clean designs, soft fabrics, and everyday comfort — because you deserve to look and feel amazing, always.</p>
        <b className='text-gray-800'>Our Mission</b>
        <p>At Forever, our mission is to bring simplicity and elegance together. We craft pieces that blend comfort, quality, and style — empowering individuals to express themselves effortlessly. Every collection is created with attention to detail, sustainability in mind, and a promise to make you feel good in what you wear.</p>
      </div>
      </div>

      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Your comfort and confidence matter to us. That’s why every product is carefully tested for quality, fit, and finish before it reaches you. We promise premium fabrics, fine craftsmanship, and a reliable shopping experience, every single time.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b> 
          <p className='text-gray-600'>Shopping with us is designed to be effortless. From easy navigation to smooth checkout and quick delivery, we ensure a hassle-free experience from start to finish</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b> 
          <p className='text-gray-600'>We’re committed to offering exceptional customer service with timely support, transparent communication, and a dedicated team ensuring your shopping experience remains smooth and worry-free.</p>
        </div> 
      </div> 
      
      <NewsLetterBox />
    </div> 
  )
}

export default About