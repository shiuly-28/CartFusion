"use client"
import React, { useState } from 'react'
import { AnimatePresence, motion} from 'motion/react'
import { AiOutlineShop } from 'react-icons/ai'



function EditMerchantDetails() {
    const [shopName, setShopName] = useState("")
    const [shopAddress, setShopAddress] = useState("")
    const [gstNumber, setGstNumber] = useState("")
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white p-6'>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y:-40 }}
            animate={{ opacity: 1, y:0 }}
            exit={{ opacity: 0, y:-40 }}
            transition={{duration:0.5}}
            className='w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl
            p-8 border border-white/10'>
            <h3 className='text-3xl font-semibold text-center mb-4'>Complete Your Shop Details</h3>
            <p className='text-center text-gray-300 mb-6 text-sm'>
                Enter your business information to activate your merchant account.
            </p>
            <form className='flex flex-col gap-6'>
                <div className='relative'>
                    <AiOutlineShop className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={22}/>
                    <input type='text'
                    placeholder='Shop Name'
                    required
                    className='w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10
                    focus:outline-none focus:right-2 focus:ring-[#00684D]'
                    onChange={(e) =>setShopName(e.target.value)}
                    value={shopName}/>
                </div>
                <div className='relative'>
                    <AiOutlineShop className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={22}/>
                    <input type='text'
                    placeholder='Shop Name'
                    required
                    className='w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10
                    focus:outline-none focus:right-2 focus:ring-[#00684D]'
                    onChange={(e) =>setShopName(e.target.value)}
                    value={shopName}/>
                </div>
            </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default EditMerchantDetails
