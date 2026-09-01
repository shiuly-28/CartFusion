
"use client"
import React from 'react'
import {  AnimatePresence, motion } from "motion/react"
import { useRouter } from 'next/navigation'

function MerchantProduct() {
  const router = useRouter()
  return (
     <div className='w-full p-4 sm:p-8 text-white'>
      {/* header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold'>My Products</h1>
        <motion.button
        whileHover={{scale:1.03}}
        whileTap={{scale: 0.9}}
        onClick={()=>router.push("/addMerchantProduct")}
        className='bg-[#00684D] hover:bg-[#045f47] px-5 py-2 rounded-lg font-semibold text-sm sm:text-base'
        >+ Add Product</motion.button>
      </div>
        
      
    </div>
  )
}

export default MerchantProduct
