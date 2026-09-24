/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import ProductCard from '@/component/ProductCard';
import UseGetAllMerchant from '@/hooks/UseGetAllMerchant';
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';

function ShopDetails() {
    const params = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const merchantId = params.id as string;
    
    UseGetAllProducts()
    UseGetAllMerchant()

    const { AllMerchantData } = useSelector((state: RootState) => state.merchant)
    const { allProductData } = useSelector((state: RootState) => state.merchant)

    // Check if user is currently on the home page
    const isHomePage = pathname === '/'

    const merchant = AllMerchantData.find((v: any) => String(v._id) === merchantId)

    if (!merchant) {
        return (
            <div className='min-h-screen text-xl sm:text-3xl flex flex-col items-center justify-center gap-4 text-white bg-black px-4 text-center'>
                {!isHomePage && (
                    <button 
                        onClick={() => router.push('/shop')}
                        className='flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition'
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Shops</span>
                    </button>
                )}
                <p>No Merchant Shop found</p>
            </div>
        )
    }

    const merchantProducts = Array.isArray(allProductData) && merchant?._id ?
        allProductData.filter((p: any) => p.merchant?._id && String(p.merchant._id) === String(merchant._id)) : []

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 
    pt-20 sm:pt-24 pb-12 px-4 text-white'>
            <div className='max-w-6xl mx-auto mb-8 sm:mb-12'>
                {/* Responsive Back Button */}
                {!isHomePage && (
                    <button 
                        onClick={() => router.back()}
                        className='flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition mb-4 sm:mb-6'
                    >
                        <ArrowLeft size={16} className='sm:w-[18px] sm:h-[18px]' />
                        <span>Back</span>
                    </button>
                )}

                <div className='bg-white/10 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/20 grid md:grid-cols-2 gap-6 shadow-xl'>
                    <div className='relative w-full h-52 sm:h-60 overflow-hidden rounded-xl bg-black flex items-center justify-center'>
                        {merchant.image ? (
                            <Image src={merchant.image} alt="img" fill className="object-cover"/>
                        ) : (
                            <span className='text-white text-sm sm:text-base'>No image found</span>
                        )}
                    </div>
                    <div className='flex flex-col justify-center'>
                        <h1 className='text-xl sm:text-2xl font-bold text-white mb-2'>{merchant.shopName}</h1>
                        <p className='text-gray-300 text-sm sm:text-base mb-2'>{merchant.shopAddress}</p>
                        <p className='text-gray-400 mb-3 text-xs sm:text-sm'>GSTIN: {merchant.gstNumber}</p>
                        <span className='text-[10px] w-fit px-3 py-1 rounded-full font-medium bg-[#00684D] text-[#10e6ac] uppercase tracking-wider'>
                            {merchant.verificationStatus}
                        </span>
                    </div>
                </div>
            </div>

            <div className='max-w-6xl mx-auto'>
                <h2 className='text-xl sm:text-2xl font-bold mb-6 sm:mb-8'>Products By: {merchant.shopName}</h2>
                {merchantProducts?.length === 0 ? (
                    <p className='text-gray-400 text-sm sm:text-base'>
                        No products added by this shop yet.
                    </p>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
                        {merchantProducts?.map((p: any, i: number) => (
                            <ProductCard key={i} product={p}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShopDetails