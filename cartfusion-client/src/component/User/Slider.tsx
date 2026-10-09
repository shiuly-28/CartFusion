"use client"

import React, { useEffect, useState, useMemo } from 'react'
import slider from '@/assets/slider.png'
import slider1 from '@/assets/slider1.png'
import slider2 from '@/assets/slider2.png'

import banner1 from '@/assets/banner1.jpeg'
import banner2 from '@/assets/banner2.jpeg'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function Slider() {
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  const slides = useMemo(() => [
    {
      image: slider1,
      subtitle: "DO IT NOW",
      description: "Running Shoes",
      title: "RUN ON AIR",
      button: "DISCOVER"
    },
    {
      image: slider,
      subtitle: "NEW COLLECTION",
      description: "Women's Fashion Accessories",
      title: "STYLE & COMFORT",
      button: "DISCOVER"
    },
    {
      image: slider2,
      subtitle: "FEEL THE SPEED",
      description: "Smart Gadgets for Smart People",
      title: "STEP INTO POWER",
      button: "DISCOVER"
    },
  ], [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    // 🟢 mt-[70px] যোগ করা হয়েছে যাতে মোবাইলেও নেভবারের নিচে স্পেস থাকে
    <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 mt-[70px] md:mt-[80px] px-4 md:px-10 font-sans'>
      
      {/* 🟢 Bam Pasher Dynamic Slider */}
      <div className='relative md:col-span-2 min-h-[50vh] md:min-h-[75vh] overflow-hidden rounded-2xl bg-gray-100 text-white'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute inset-0'
          >
            <Image 
              src={slides[current].image} 
              alt={slides[current].title}
              fill
              priority={current === 0} 
              sizes="(max-width: 768px) 100vw, 66vw"
              className='object-cover'
            />
            
            <div className='absolute inset-0 flex flex-col justify-end items-start px-8 md:px-12 pb-10 md:pb-16 bg-gradient-to-t from-black/60 via-black/10 to-transparent'>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className='text-[10px] md:text-xs uppercase tracking-widest text-white/90 font-semibold'
              >
                {slides[current].subtitle}
              </motion.h3>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='text-2xl md:text-5xl font-bold mb-2 mt-1'
              >
                {slides[current].description}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='text-sm md:text-lg text-white/90 mb-5'
              >
                {slides[current].title}
              </motion.p>
              
              <motion.button 
                className='px-6 py-2.5 bg-[#00684D] text-white hover:bg-[#045f47] text-xs font-bold uppercase tracking-widest rounded-full shadow-md transition'
                onClick={() => router.push("/category")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {slides[current].button}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Counter (01 / 03) */}
        <div className='absolute top-4 right-6 z-10 text-white/80 text-sm'>
          <span className='text-xl md:text-2xl font-semibold text-white'>0{current + 1}</span> / 0{slides.length}
        </div>

        {/* Thumbnails */}
        <div className='absolute bottom-4 right-4 md:right-8 flex gap-3 z-10'>
          {slides.map((slide, index) => (
            <div 
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative w-16 h-10 md:w-20 md:h-12 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === current
                  ? "border-white shadow-md"
                  : "border-white/40 hover:border-white"
              }`}
            >
              <Image 
                src={slide.image} 
                alt={slide.title} 
                fill 
                sizes="80px"
                className='object-cover'
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🔵 Dhan Pasher Fixed Banners */}
      <div className='flex flex-col gap-4'>
        
        {/* 1st Fixed Banner */}
        <div 
          onClick={() => router.push("/shop")}
          className='relative flex-1 min-h-[16vh] md:min-h-0 rounded-2xl overflow-hidden bg-gray-100 text-white group cursor-pointer'
        >
          <Image 
            src={banner1} 
            alt="Exclusive Deal" 
            fill 
            sizes="(max-width: 768px) 100vw, 33vw"
            className='object-cover object-center group-hover:scale-105 transition-transform duration-500' 
          />
          <div className='absolute inset-0 flex flex-col justify-end px-6 pb-5 bg-gradient-to-t from-black/60 via-black/10 to-transparent'>
            <p className='text-[10px] uppercase text-white/90 font-semibold tracking-widest'>Exclusive Deal</p>
            <h2 className='text-xl md:text-2xl font-bold my-1'>UP TO <span className='text-red-400'>40%</span> OFF</h2>
            <p className='text-xs md:text-sm text-white/90'>NEXT-GEN TECH</p>
          </div>
        </div>

        {/* 2nd Fixed Banner */}
        <div 
          onClick={() => router.push("/shop")}
          className='relative flex-1 min-h-[16vh] md:min-h-0 rounded-2xl overflow-hidden bg-gray-100 text-white group cursor-pointer'
        >
          <Image 
            src={banner2} 
            alt="Free Shipping" 
            fill 
            sizes="(max-width: 768px) 100vw, 33vw"
            className='object-cover group-hover:scale-105 transition-transform duration-500' 
          />
          <div className='absolute inset-0 flex flex-col justify-end px-6 pb-5 bg-gradient-to-t from-black/60 via-black/10 to-transparent'>
            <p className='text-[10px] uppercase text-white/90 font-semibold tracking-widest'>Limited Time</p>
            <h2 className='text-xl md:text-2xl font-bold my-1'>FREE SHIPPING</h2>
            <p className='text-xs md:text-sm text-white/90'>PREMIUM AUDIO</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Slider