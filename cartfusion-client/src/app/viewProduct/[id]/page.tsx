"use client"
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import { IProduct } from '@/model/product.model';
import { RootState } from '@/redux/store';
import { div, image } from 'motion/react-client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function ViewProduct() {
    const params = useParams()
    const productId = params.id as string;
    UseGetAllProducts()

    const {allProductData} = useSelector((state:RootState) =>state.merchant)
    
    const  product:IProduct | undefined = allProductData?.find((p:IProduct)=>String(p._id) === String(productId))
  
    const images : string[]= [
        product?.image1,
        product?.image2,
        product?.image3,
        product?.image4
    ].filter((img): img is string => Boolean(img))

    const [activeImage, setActiveImage] = useState(0)
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 
    via-black to-gray-900 px-4 p-10'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* left loop */}
            <div className='flex flex-col lg:flex-row gap-4'>
                {/* main image */}
                <div className='relative w-full lg:w-[450px] h-[420px] bg-black rounded-lg overflow-hidden
                flex items-center justify-center border border-white/10'>
                    {images.length > 0 && images[activeImage] &&
                        <Image  src={images[activeImage]} alt={product?.title ?? "product image"}
                    fill
                    className='object-contain'
                    priority/>}
                </div>

                {/* image thumbless */}
               <div className='flex flex-row lg:flex-col gap-3 justify-center'>
            {images.map((img, i) => (
           <div 
          key={i} 
          onClick={() => setActiveImage(i)} 
          className={`relative w-20 h-20 border-2 rounded-lg cursor-pointer 
          overflow-hidden flex items-center justify-center hover:scale-105 
          transition-all duration-200 ${
            activeImage === i
            ? "border-[#00684D] shadow-md"
            : "border-gray-200 dark:border-white/20 hover:border-gray-400"  
          }`}>
          <Image 
          src={img} 
          alt={`Product preview ${i + 1}`} 
          fill 
         className="object-cover"/>
        </div>
       ))}
      </div>
        </div>
          {/* Right bottom */}
          <div>
            <h3 className='text-3xl text-white font-bold mb-3'>{product?.title}</h3>
            <p className='text-gray-500 font-bold'>{product?.category}</p>
            <p className='text-2xl text-[#00684D] font-bold'>৳</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProduct
