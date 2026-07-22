"use client"
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { RiContractLeftRightLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function Register() {
    const [step, setStep] = useState<1 | 2>(1)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white p-6'>

        <AnimatePresence mode='wait'>
      {step == 1 && <motion.div 
      initial={{ opacity: 0, y:-40 }}
      animate={{ opacity: 1, y:0 }}
      exit={{ opacity: 0, y:-40 }}
      transition={{duration:0.5}}
      className='w-full max-w-lg text-center bg-white/10 backdrop-blur-md rounded-2xl
      shadow-2xl p-10 border border-white/20'>
        <h1 className='text-4xl font-bold mb-4 text-[#00684D]'>Welcome to CartFusion</h1>
        <p className='text-gray-300 mb-6'>Register with one of the following account types:</p>
        <div className='grid grid-cols-3 gap-4 mb-6'>
            {
                [
                    {label:"User", icon: "👤", value: "user"},
                    {label:"merchant", icon: "🏬", value: "merchant"},
                    {label:"Admin", icon: "👤", value: "admin"},

                ].map((item, index)=>(
                    <motion.div
                    key={item.value}
                    whileHover={{scale: 0.95}}
                    className='p-4 bg-white/10 hover:bg-white/20 cursor-pointer rounded-xl
                    border border-white/30 shadow-lg flex flex-col items-center transition'

                    >
                      <span className='text-4xl mb-2'>{item.icon}</span>
                      <span className='text-sm font-medium'>{item.value}</span>
                    </motion.div>
                ))
            }

        </div>

        <motion.button
        onClick={()=>setStep(2)}
        whileHover={{scale: 1.1}}
        whileTap={{scale: 0.95}}
        className='mt-4 px-4 py-3 bg-[#00684D] hover:bg-[#049770] rounded-xl font-medium 
        flex items-center justify-center gap-1 w-full'
        >Next <RiContractLeftRightLine /></motion.button>
      </motion.div>}

      {step == 2 &&<motion.div
          initial={{ opacity: 0, y:40 }}
      animate={{ opacity: 1, y:0 }}
      exit={{ opacity: 0, y:-40 }}
      transition={{duration:0.5}}
      className='w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl
      p-8 border border-white/20'
      >
        <h1 className='text-2xl font-semibold text-center mb-6 text-[#049770]'>Create your Account</h1>
        <form action="" className='flex flex-col gap-4'>

          <input type="text"
          required
          placeholder='Full Name'
          className='bg-white/10 border border-white/30 rounded-lg p-3
          focus:outline-none focus:ring-2 focus:ring-[#00684D]' 
          onChange={(e) =>setName(e.target.value)} value={name}/>

          <input type="text"
          required
          placeholder='Email'
          className='bg-white/10 border border-white/30 rounded-lg p-3
          focus:outline-none focus:ring-2 focus:ring-[#00684D]' 
          onChange={(e) =>setEmail(e.target.value)} value={email}/>

        
         <div className="relative">
  <input 
    type={showPassword ? "text" : "password"}
    required
    placeholder='password'
    className='bg-white/10 border border-white/30 rounded-lg p-3 w-full
    focus:outline-none focus:ring-2 focus:ring-[#00684D]' 
    onChange={(e) => setPassword(e.target.value)} 
    value={password}
  />
  <button
    type='button'
    onClick={() => setShowPassword(!showPassword)}
    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition'
  >
    {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
  </button>
</div>

            <motion.button
        type='submit'
        whileHover={{scale: 1.03}}
        whileTap={{scale: 0.95}}
        className='mt-4 px-4 py-3 bg-[#00684D] hover:bg-[#049770] top-61 rounded-xl font-medium 
        flex items-center justify-center gap-1 w-full'
        >Register Now<RiContractLeftRightLine />
        </motion.button>
          
          <div className='flex items-center my-3'>
            <div className='flex-1 h-px bg-gray-600'></div>
            <span className='px-3 text-sm text-gray-400'>or</span>
            <div className='flex-1 h-px  bg-gray-600'></div>
          </div>

          <motion.button
     
        whileHover={{scale: 1.03}}
        whileTap={{scale: 0.95}}
        className='flex items-center py-3 bg-white/10 hover:bg-white/20 border border-white/30 top-61 rounded-xl font-medium 
         justify-center gap-3 w-full transition'
        ><FcGoogle className='w-5 h-5' />
          <span className='font-medium'>Continue With Google</span>
        </motion.button>
        <p className='text-center text-sm mt-4 text-gray-400'>Already have an account{" "}
          <span className='text-[#00684D] hover:text-[#049770]'>signIn</span>
        </p>
        </form>
      </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default Register
