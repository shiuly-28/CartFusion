"use client"
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { RiContractLeftRightLine } from "react-icons/ri";

function Register() {
    const [step, setStep] = useState<1 | 2>(1)
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
        whileHover={{scale: 1.1}}
        whileTap={{scale: 0.95}}
        className='mt-4 px-4 py-3 bg-[#00684D] hover:bg-[#049770] rounded-xl font-medium 
        flex items-center justify-center gap-1 w-full'
        >Next <RiContractLeftRightLine /></motion.button>
      </motion.div>}

      {step == 2 &&<motion.div>

      </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default Register
