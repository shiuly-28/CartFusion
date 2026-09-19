/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import ProductCard from '@/component/ProductCard';
import UseGetAllMerchant from '@/hooks/UseGetAllMerchant';
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import { RootState } from '@/redux/store';
import { div } from 'motion/react-client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';

function ShopDetails() {
    const params = useParams()
    const merchantId = params.id as string;
    UseGetAllProducts()
    UseGetAllMerchant()

    const {AllMerchantData} = useSelector((state:RootState)=>state.merchant)
    const {allProductData} = useSelector((state:RootState)=>state.merchant)

    const merchant = AllMerchantData.find((v:any)=>String(v._id) === merchantId)
    
      if(!merchant){
        return(
            <div className='min-h-screen text-3xl flex items-center justify-center text-white bg-black'>
                Merchant Shop found
            </div>
        )
    }

    const merchantProducts = Array.isArray(allProductData)?
     allProductData.filter((p:any) =>p.merchant._id === merchant._id) : []
     console.log(merchantProducts)

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 
    py-6 px-4 text-white'>
     <div className='max-w-6xl mx-auto mb-12 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20
     grid md:grid-cols-2 gap-6 shadow-xl'>
        <div className='relative w-full h-60 overflow-hidden rounded-xl bg-black flex items-center justify-center'>
            {merchant.image ?<Image src={merchant.image} alt="img"
             fill className="object-cover"/> :<span className='text-white'>No image found </span>}
        </div>
        <div className='flex flex-col justify-center'>
            <h1 className='text-gray-300 mb-2'>{merchant.shopName}</h1>
            <p className='text-gray-300 mb-2'>{merchant.shopAddress}</p>
            <p className='text-gray-300 mb-1 text-sm'>GSTIN: {merchant.gstNumber}</p>
            <span className='text-[10px] w-fit px-3 py-1 rounded-full font-medium bg-[#00684D]
             text-[#10e6ac] '>{merchant.verificationStatus}</span>
        </div>
     </div>
     <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8'>Product By:{merchant.shopName}</h2>
        {merchantProducts?.length === 0 ?
        (<p>
            No products added by this shop yet
        </p>
        ):(
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {merchantProducts?.map((p:any, i:number)=>(
                <ProductCard key={i} product={p}/>
            ))}
        </div>
        )}
     </div>
    </div>
  )
}

export default ShopDetails
