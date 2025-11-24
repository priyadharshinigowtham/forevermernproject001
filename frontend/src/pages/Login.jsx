import React, { useState } from 'react'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

  }
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Login' ? '' : <input type='text' className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/>}
      <input type='email' className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
      <input type='password' className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
      
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer text-gray-500 hover:text-black'>Forget password?</p>
        
        
        {currentState === 'Login'
          ? <p>Don't have an account? <span onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-black font-medium hover:underline'>Sign Up</span></p>
          : <p>Already have an account? <span onClick={() => setCurrentState('Login')} className='cursor-pointer text-black font-medium hover:underline'>Login here</span></p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login