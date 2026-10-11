"use client"

import React from 'react'
import { motion } from "motion/react"
import { FaBox, FaCheckCircle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

function OrderSuccess() {
  const router = useRouter()
  return (
    <div className='min-h-screen bg-white text-gray-900 flex items-center justify-center '>
      <motion.div
        initial={{ opacity: 0, y:40 }}
              animate={{ opacity: 1, y:0 }}
              transition={{duration:0.5}}
      className='bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
       p-10 max-w-md w-full text-center'>
        <motion.div
           initial={{ rotate:-188, opacity: 0,}}
          animate={{rotate: 0, opacity: 1}}
          transition={{duration:0.7}}
          className='flex justify-center'>
            <FaCheckCircle className='text-[#00684D]' size={120}/>
        </motion.div>
        <h1 className='text-3xl font-bold text-gray-700 mt-6'>Order Placed Successfully</h1>
        <div className='flex flex-col items-center gap-2 mt-4 text-gray-300'>
          <FaBox size={32} className='text-[#00684D]'/>
          <p className='text-gray-700'>Your order has been recived and is now being processed</p>
        </div>

        <motion.div
        onClick={()=>router.push("/orders")}
        whileHover={{scale: 1.05}}
        whileTap={{ scale: 0.96 }}
        className='mt-8 w-full py-3 rounded-lg bg-[#00684D] hover:bg-[#09c08f]
         text-white font-semibold'>
          Go to Order Page
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OrderSuccess