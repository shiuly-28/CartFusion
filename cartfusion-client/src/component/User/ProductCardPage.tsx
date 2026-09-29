/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import ProductCard from '../ProductCard'

function ProductCardPage() {

    const {allProductData} = useSelector((state:RootState)=>state.merchant)

    const products = Array.isArray(allProductData) ? 
    allProductData.filter((p:any)=>p.isActive === true && p.verificationStatus === "approved") : []

    if(!products || products.length===0){
        return(
            <div className='min-h-[30vh] flex items-center justify-center text-gray-500 bg-white'>
                No Products found
            </div>
        )
    }
    
  return (
    <div className='min-h-[30vh] w-full bg-white text-gray-900 px-4 md:px-10 py-8'>
        <div className='max-w-7xl mx-auto mb-8'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight'>
                Trending Products
            </h1>
            <p className='text-sm text-gray-500 mt-1'>Shop only from approved sellers with guaranteed quality</p>
        </div>

        <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {products.map((p:any)=>(
                    <ProductCard key={p._id} product={p}/>
                ))}
            </div>
        </div>
      
    </div>
  )
}

export default ProductCardPage