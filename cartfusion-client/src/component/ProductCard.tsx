"use client"
import { IProduct } from '@/model/product.model'
import React, { useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight, FaRegStar, FaShoppingCart, FaStar } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { IUser } from '@/model/user.model' 

function ProductCard({product} : {product:IProduct}) {
  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4
  ].filter(Boolean)
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent((prev)=> (prev + 1) % images.length)
  }
  const prev = () => {
    setCurrent((prev)=> (prev - 1 + images.length) % images.length)
  }

  const router = useRouter()
  const totalReviews = product?.reviews?.length ?? 0
  const avgRating = product && totalReviews > 0 
    ? (product.reviews!.reduce((sum:number, r : {rating:number})=> sum + r.rating, 0)/totalReviews).toFixed(1) 
    : 0

  return (
    <motion.div 
      onClick={()=>router.push(`/viewProduct/${product._id}`)}
      initial={{opacity: 0, y: 60 }}
      whileInView={{opacity: 1, y: 0}}   
      transition={{type: "spring", stiffness:70, damping: 18}}
      viewport={{once:true, amount: 0.2}}
      whileHover={{scale: 1.02}}
      className='bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden
      border border-white/10 hover:border-white/30 transition cursor-pointer text-white flex flex-col justify-between'
    >
      {/* Image Container with Dark Theme Neutral Background */}
      <div className='relative w-full h-[220px] bg-black/40 overflow-hidden flex items-center justify-center p-2'>
        <div className='relative w-full h-full'>
          <Image 
            src={images[current]}
            alt={product.title}
            fill
            className='object-contain rounded-lg'
            sizes='(max-width: 768px) 100vw, 300px'
          />
        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={(e) =>{
            e.stopPropagation();
            next()
          }}
          className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black rounded-full text-white z-10 p-2 transition'
        >
          <FaChevronLeft size={12}/>
        </button>

        <button
          onClick={(e) =>{
            e.stopPropagation();
            prev()
          }}
          className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black rounded-full text-white z-10 p-2 transition'
        >
          <FaChevronRight size={12}/>
        </button>

        {/* Dots Indicator */}
        <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10'>
          {images.map((_, i)=>(
            <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${
              current === i ? "bg-white w-3" : "bg-white/40"
            }`}/>
          ))}
        </div>
      </div>

      {/* Product Content Data */}
      <div className='p-4 space-y-2 flex-1 flex flex-col justify-between'>
        <div>
          <h3 className='font-semibold text-sm text-gray-100 line-clamp-1'>{product.title}</h3>
          <p className='font-medium text-xs text-gray-400 mt-1'>{product.category}</p>
          <p className='font-bold text-lg text-[#10B981] mt-1'>৳ {product.price}</p>

          <div className='flex items-center gap-1 text-yellow-400 text-xs mt-1'>
            {[1,2,3,4,5].map((i)=>(
              i <= Math.round(Number(avgRating)) ?
              <FaStar key={i}/> : <FaRegStar key={i} className="text-gray-500"/>
            ))}
            <span className='text-gray-400 text-xs ml-1'>
              ({avgRating} / {totalReviews})
            </span>
          </div>

          <p className='text-xs text-gray-400 mt-2'>
            <span>{(product?.merchant as IUser)?.shopName || "Unknown Shop"}</span>
          </p>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className='w-full mt-3 bg-[#00684D] hover:bg-[#008663] text-white py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium text-sm'
        >
          <FaShoppingCart size={14}/> Add to cart
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ProductCard