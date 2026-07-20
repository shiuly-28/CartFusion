"use client"
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"

function Register() {
    const [step, setStep] = useState<1 | 2>()
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white p-6'>

        <AnimatePresence mode='wait'>
      {step == 1 && <motion.div 
      className='w-full max-w-lg text-center bg-white/10 backdrop-blur-md rounded-2xl
      shadow-2xl p-10 border border-white/20'>
        
      </motion.div>}

      {step == 2 &&<motion.div>

      </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default Register
