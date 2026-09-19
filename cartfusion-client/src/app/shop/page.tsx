/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import UseGetAllMerchant from '@/hooks/UseGetAllMerchant'
import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import { motion } from "motion/react"

import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

function ShopPage() {
    UseGetAllMerchant()
    const router = useRouter()
    const {AllMerchantData} = useSelector((state:RootState) => state.merchant)

    const allVerifiedMerchant = Array.isArray(AllMerchantData)?
    AllMerchantData.filter((v:any)=>v.verificationStatus === "approved"):[]

    if(!allVerifiedMerchant || allVerifiedMerchant.length === 0){
        return(
            <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 
    py-6 px-4 text-white text-3xl text-center'>
                No Shop found
            </div>
        )
    }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 
    py-6 px-4 text-white'>
      <div className='max-w-7xl mx-auto mb-13 text-center'>
        <h1 className='text-2xl sm:text-3xl font-bold text-white'>Explore Trusted Shop & Verified Sellers</h1>
        <p className='text-gray-300 text-sm'>Discover Verified Merchant, authentication stores & their exclusive products.</p>
      </div>

      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {allVerifiedMerchant.map((v:IUser,i:number)=>(
            <motion.div key={i}
            onClick={()=>router.push(`/shopDetails/${v._id}`)}
            className='bg-white text-black rounded-2xl p-4 cursor-pointer
            border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300'>
                <div className='relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-xl
                bg-gray-200 flex items-center justify-center'>
                    {v.image ? <Image src={v.image} alt='img' fill className='object-cover'/>
                    :<div>No image found</div>}
                </div>
                <h2 className='font-semibold text-center'>{v.shopName}</h2>
                <p className='text-xs text-gray-500 text-center mt-1 line-clamp-2'>{v.shopAddress}</p>
                <div className='flex justify-center mt-2'>
                <span className='text-[10px] px-3 py-1 rounded-full font-medium bg-[#00684D] text-[#10e6ac]'>{v.verificationStatus}</span>
                </div>
            </motion.div>
            ))}

        </div>
      </div>
    </div>
  )
}

export default ShopPage
