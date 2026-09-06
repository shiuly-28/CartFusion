"use client"
import { IProduct } from '@/model/product.model'
import React, { useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function ProductCard({product} : {product:IProduct}) {
  const images = [

    product.image1,
    product.image2,
    product.image3,
    product.image4
  ].filter(Boolean)
  const [current, setCurrent] = useState(0)
  return (
    <motion.div 
      initial={{opacity: 0, y: 60 }}
      whileInView={{opacity: 1, y: 0}}   
      transition={{type: "spring", stiffness:70, damping: 18}}
      whileHover={{scale: 1.03}}
      className='bg-white rounded-xl shadow-md overflow-hidden
      border hover:shadow-xl transition cursor-pointer'>
      {/* images */}
      <div className='relative w-full h-[220px] bg-gray-300 overflow-hidden flex items-center justify-center'>
        <div className='relative w-[90%] h-[90%]'>

          <Image src={images[current]}
          alt={product.title}
          fill
          className='object-contain'
          sizes='(max-width: 768px) 100vw, 300px'/>
        </div>
        <button>
          <FaChevronLeft/>
        </button>
        <button>
          <FaChevronRight/>
        </button>
      </div>
      {/* producData */}
      <div className='p-4 space-y-2'></div>
    </motion.div>
  )
}

export default ProductCard
