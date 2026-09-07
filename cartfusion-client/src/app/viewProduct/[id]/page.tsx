"use client"
import ProductCard from '@/component/ProductCard';
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import { IProduct } from '@/model/product.model';
import { RootState } from '@/redux/store';
import { AnimatePresence, motion } from "motion/react"
import { p } from 'motion/react-client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function ViewProduct() {
    const params = useParams()
    const productId = params.id as string;
    UseGetAllProducts()
    const [reviewsRating, setReviewsRating] = useState(0)
    const [reviewsComment, setReviewsComment] = useState("")
    const [reviewsImage, setIeviewsImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const {allProductData} = useSelector((state:RootState) =>state.merchant)
    
    const  product:IProduct | undefined = allProductData?.find((p:IProduct)=>String(p._id) === String(productId))
    // console.log("PRODUCT DATA:", product)
  
    const images : string[]= [
        product?.image1,
        product?.image2,
        product?.image3,
        product?.image4
    ].filter((img): img is string => Boolean(img))

    const relatedProducts = allProductData.filter((p)=> p.category === product?.category
     && p._id !==product._id)

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
          {product && <div>
            <h3 className='text-3xl text-white font-bold mb-3'>{product?.title}</h3>
            <p className='text-gray-500 font-bold'>{product?.category}</p>
            <p className='text-2xl text-[#00684D] font-bold'>৳ {product?.price}</p>
            <div className='flex items-center gap-2 mt-1 mb-4'>
              <div className='flex text-yellow-400'>
                {[1, 2, 3, 4, 5].map((i)=>(
                  <FaStar key={i}/>
                ))}
              </div>
              <span className='text-sm text-gray-400'>(4 / 120) Reviews</span>
            </div>
            <p className='mb-4 text-gray-300'>{product?.description}</p>
            <p className='mb-3 text-gray-50'>
              Stock : {" "}<span className={product.stock > 0
                ? "text-[#00684D]"
                : "text-red-400"
              }>
                {product?.stock > 0 ? "In  Stock" : "Out of Stock"}
              </span>
            </p>
            <motion.button 
            
            whileHover={{scale: 1.02}}
            whileTap={{scale:0.96}}
            className='w-full bg-[#00684D] hover:bg-[#045f47]
             py-3 rounded font-semibold transition text-white'
            >
              Add to Cart
            </motion.button>
          </div>}
        </div>

        {product && <div className='mt-10 bg-white/5 border border-white/10 rounded-lg p-6'>
          {product.isWearable && (
            <div className='mb-5'>
              <p className='font-semibold mb-2 text-white'>
                Available Sizes
              </p>
              <div className='flex flex-wrap gap-2'>
                {product.size?.map((s)=>(
                  <span key={s} className='px-3 py-1 border bg-white border-white/20 rounded'>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className='space-y-2 text-gray-300'>
            {typeof product.replacementDays == "number" && product.replacementDays > 0 && (
              <p>✅ {product.replacementDays} Days Replacement</p>
            )}
            {product.freeDelivery === true && <p>✅ Free Delivery</p>}
            {product.payOnDevelivery === true && <p>✅ Cash on Delivery Available</p>}
            {product.warranty && product.warranty !== "No warranty" &&
             <p>✅ warranty: {product.warranty}</p>}
          </div>
          {Array.isArray(product.detailsPoint) && product.detailsPoint.length > 0 && (
            <div className='mb-6'>
              <h3 className='font-semibold mb-2 text-white'>Hightlights</h3>
              <ul className='list-disc pl-5 space-y-1 text-gray-300'>
                {product.detailsPoint.map((p,i)=>(
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>}

        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <div className='mt-12 bg-white/5 border border-white/10 rounded-lg p-6'>
            <h3 className='text-2xl font-bold mb-5 text-white'>Related Products</h3>
           <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'>
             {relatedProducts.slice(0.8).map((rp)=>(
            <ProductCard key={rp._id?.toString()} product={rp}/>
            ))}
           </div>
          </div>
        )}

        <div className='mt-16 bg-white/5 border border-white/10 rounded-lg p-6'>
          <h2 className='text-white text-2xl font-bold mb-6'>Custom Reviews</h2>
          <div className='mb-8'>
            <p className='text-white font-semibold mb-2'>Add your Review</p>
            <div className='flex gap-2 mb-3 text-yellow-400'>
              {
                [1, 2, 3, 4, 5].map((i)=>(
                  <span className='cursor-pointer'
                   onClick={()=>setReviewsRating(i)} key={i}>
                    {i<= reviewsRating ? <FaStar/> : <FaRegStar/>}
                  </span>
                ))
              }
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default ViewProduct
