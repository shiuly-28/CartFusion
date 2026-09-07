
"use client"
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import ProductCard from '../ProductCard'

function ProductCardPage() {

    const {allProductData} = useSelector((state:RootState)=>state.merchant)

    const products = Array.isArray(allProductData) ? 
    allProductData.filter((p:any)=>p.isActive === true && p.verificationStatus === "approved") : []
    // console.log(products)
    
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white px-4 p-6'>
        <div className='max-w-7xl mx-auto mb-13 text-center'>
            <h1 className='text-2xl sm:text-3xl font-bold text-white'>
                Explore Verified & Trending Products
            </h1>
            <p className='text-sm text-gray-200'>Shop Only from aprroved sellers with guaranteed quality</p>
        </div>

        <div className='max-w-7xl mx-auto'>
            {products.length === 0 ? (
                <div className='text-center text-gray-500 mt-20'>
                    No products available right now.
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {products.map((p:any)=>(
                        <ProductCard key={p._id} product={p}/>
                    ))}
                </div>
            )}
        </div>
      
    </div>
  )
}

export default ProductCardPage
