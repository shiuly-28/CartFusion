/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';

function ShopDetails() {
    const params = useParams()
    const merchantId = params.id as string;

    const {AllMerchantData} = useSelector((state:RootState)=>state.merchant)

    const merchant = AllMerchantData.find((v:any)=>String(v._id) === merchantId)
    
      if(!merchant){
        return(
            <div className='min-h-screen text-3xl flex items-center justify-center text-white bg-black'>
                Merchant Shop found
            </div>
        )
    }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 
    py-6 px-4 text-white'>
     <div className='max-w-6xl mx-auto mb-12 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20
     grid md:grid-cols-2 gap-6 shadow-xl'>
        <div className='relative w-full h-60 overflow-hidden rounded-xl bg-black flex items-center justify-center'>
            {merchant.image ?<Image src={merchant.image} alt="img"
             fill className="object-cover"/> :<span className='text-white'>No image found </span>}
        </div>
     </div>
    </div>
  )
}

export default ShopDetails
