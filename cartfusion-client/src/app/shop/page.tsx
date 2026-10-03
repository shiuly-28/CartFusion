/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import UseGetAllMerchant from '@/hooks/UseGetAllMerchant'
import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import { motion } from "motion/react"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'

function ShopPage() {
    UseGetAllMerchant()
    const router = useRouter()
    const pathname = usePathname()
    const { AllMerchantData } = useSelector((state: RootState) => state.merchant)

    // Home page এ থাকলে "Back to Home" বাটন দেখাবে না
    const isHomePage = pathname === '/'

    const allVerifiedMerchant = Array.isArray(AllMerchantData) ?
        AllMerchantData.filter((v: any) => v.verificationStatus === "approved") : []

    if (!allVerifiedMerchant || allVerifiedMerchant.length === 0) {
        return (
            <div className='min-h-screen bg-white py-6 px-4 text-gray-500 text-xl sm:text-3xl text-center flex flex-col items-center justify-center gap-4'>
                {!isHomePage && (
                    <button 
                        onClick={() => router.push('/')}
                        aria-label="Back to Home"
                        className='flex items-center gap-2 text-xs sm:text-sm text-gray-700 hover:text-[#00684D] bg-gray-100 hover:bg-gray-200 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition'
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Home</span>
                    </button>
                )}
                <p>No Shop found</p>
            </div>
        )
    }

    return (
        <div className='min-h-[30vh] w-full bg-white text-gray-900 px-3 sm:px-6 py-6 sm:py-8'>
            <div className='max-w-7xl mx-auto mb-6 sm:mb-8'>
                {!isHomePage && (
                    <button 
                        onClick={() => router.push('/')}
                        aria-label="Back to Home"
                        className='flex items-center gap-2 text-xs sm:text-sm text-gray-700 hover:text-[#00684D] bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition mb-4 sm:mb-6'
                    >
                        <ArrowLeft size={16} className='sm:w-[18px] sm:h-[18px]' />
                        <span>Back to Home</span>
                    </button>
                )}

                <div>
                    <h1 className='text-xl sm:text-3xl font-bold text-gray-900 tracking-tight'>
                        Explore Trusted Shops & Verified Sellers
                    </h1>
                    <p className='text-gray-600 text-xs sm:text-sm mt-1'>
                        Discover verified merchants, authentic stores & their exclusive products.
                    </p>
                </div>
            </div>

            <div className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
                    {allVerifiedMerchant.map((v: IUser, i: number) => (
                        <motion.div 
                            key={v._id || i}
                            onClick={() => router.push(`/shopDetails/${v._id}`)}
                            whileHover={{ y: -4 }}
                            className='bg-white text-gray-900 rounded-2xl p-4 cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between'
                        >
                            <div>
                                <div className='relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100'>
                                    {v.image ? (
                                        <Image 
                                            src={v.image} 
                                            alt={v.shopName || 'Shop Image'} 
                                            fill 
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className='object-cover' 
                                        />
                                    ) : (
                                        <div className='text-xs text-gray-400'>No image found</div>
                                    )}
                                </div>
                                <h2 className='font-semibold text-center text-gray-900 text-base sm:text-lg'>
                                    {v.shopName}
                                </h2>
                                <p className='text-xs text-gray-600 text-center mt-1 line-clamp-2'>
                                    {v.shopAddress}
                                </p>
                            </div>
                            <div className='flex justify-center mt-3'>
                                <span className='text-[10px] px-3 py-1 rounded-full font-medium bg-[#00684D]/10 border border-[#00684D]/20 text-[#00684D] uppercase tracking-wider'>
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