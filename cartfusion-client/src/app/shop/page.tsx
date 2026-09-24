/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import UseGetAllMerchant from '@/hooks/UseGetAllMerchant'
import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import { motion } from "motion/react"
import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'

function ShopPage() {
    UseGetAllMerchant()
    const router = useRouter()
    const {AllMerchantData} = useSelector((state:RootState) => state.merchant)

    const allVerifiedMerchant = Array.isArray(AllMerchantData)?
    AllMerchantData.filter((v:any)=>v.verificationStatus === "approved"):[]

    if(!allVerifiedMerchant || allVerifiedMerchant.length === 0){
        return(
            <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 
    py-6 px-4 text-white text-3xl text-center flex flex-col items-center justify-center gap-4'>
                {/* Back button when no shops found */}
                <button 
                  onClick={() => router.push('/')}
                  className='flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition'
                >
                  <ArrowLeft size={18} />
                  <span>Back to Home</span>
                </button>
                <p>No Shop found</p>
            </div>
        )
    }

  return (
    <div className='min-h-[30vh] w-full bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white px-4 p-6'>
      <div className='max-w-7xl mx-auto mb-8'>
        {/* Back to Home Button */}
        <button 
          onClick={() => router.push('/')}
          className='flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition mb-6'
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>

        <div className='text-center'>
          <h1 className='text-2xl sm:text-3xl font-bold text-white'>Explore Trusted Shop & Verified Sellers</h1>
          <p className='text-gray-300 text-sm mt-1'>Discover Verified Merchant, authentication stores & their exclusive products.</p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {allVerifiedMerchant.map((v:IUser,i:number)=>(
            <motion.div key={i}
            onClick={()=>router.push(`/shopDetails/${v._id}`)}
            whileHover={{ scale: 1.02 }}
            className='bg-white/10 backdrop-blur-md text-white rounded-2xl p-4 cursor-pointer
            border border-white/10 hover:border-white/30 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between'>
                <div>
                  <div className='relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-xl
                  bg-black/40 flex items-center justify-center border border-white/5'>
                      {v.image ? <Image src={v.image} alt='img' fill className='object-cover'/>
                      :<div className='text-xs text-gray-400'>No image found</div>}
                  </div>
                  <h2 className='font-semibold text-center text-gray-100 text-lg'>{v.shopName}</h2>
                  <p className='text-xs text-gray-400 text-center mt-1 line-clamp-2'>{v.shopAddress}</p>
                </div>
                <div className='flex justify-center mt-3'>
                  <span className='text-[10px] px-3 py-1 rounded-full font-medium bg-[#00684D]/80 border border-[#10e6ac]/30 text-[#10e6ac] uppercase tracking-wider'>
                    {v.verificationStatus}
                  </span>
                </div>
            </motion.div>
            ))}

        </div>
      </div>
    </div>
  )
}

export default ShopPage