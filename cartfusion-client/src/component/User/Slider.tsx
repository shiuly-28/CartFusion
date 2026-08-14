"use client"

import React, { useState } from 'react'
import slider from '@/assets/slider.avif'
import slider1 from '@/assets/slider1.jpeg'
import slider2 from '@/assets/slider2.jpeg'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'


function Slider() {
  const [current, setCurrent] = useState(0)
    const slides = [
        {
            image:slider1,
            title: "RUN ON AIR",
            subtitle: "DO IT NOW",
            description: "Runing Shoes",
            button: "DISCOVER"
        },
        
        {
            image:slider,
            title: "STYLE & COMFORT",
            subtitle: "NEW COLECTIOPN",
            description: "Women's Fashion Accessories",
            button: "DISCOVER"
        },
        {
            image:slider2,
            title: "STEP INTO POWER",
            subtitle: "FEEL THE SPEED",
            description: "Smart Gadgets for Smart People",
            button: "DISCOVER"
        },

    ]
  return (
    <div className='relative w-full min-h-[90vh] mt-0 overflow-hidden rounded-2xl bg-black text-white md:mt-[60px] pt-0 top-0'>
      <AnimatePresence>
        <motion.div
        key={current}
        initial = {{ opacity: 0, scale: 1.05}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.95}}
        transition={{duration: 0.8 }}
         className='absolute inset-0 flex justify-center items-center'>
          <Image src={slides[current].image} alt={slides[current].title}
          className='object-cover opacity-70 fill'/>
          <div className='absolute inset-0 flex flex-col justify-center items-start px-10 md:px-24
          bg-gradient-to-r from-black/70 to-transparent '>
            <motion.h3
            initial = {{ y: 20, opacity: 0}}
            animate={{ y: 0, opacity: 1}}
            transition={{delay: 0.2 }} 
            className='text-sm md:text-base uppercase tracking-widest text-gray-300'>
                {slides[current].subtitle}
            </motion.h3>
            <motion.h1
            initial = {{ y: 40, opacity: 0}}
            animate={{ y: 0, opacity: 1}}
            transition={{delay: 0.4 }} 
            className='text-4xl md:text-6xl font-bold mb-4'>
                {slides[current].description}
            </motion.h1>
            <motion.p
            initial = {{ y: 40, opacity: 0}}
            animate={{ y: 0, opacity: 1}}
            transition={{delay: 0.6 }} 
            className='text-lg md:text-xl text-gray-300 mb-6'>
                {slides[current].title}
            </motion.p>
            <motion.button className='px-6 py-3 bg-[#00684D] hover:bg-[#037455] text-white font-medium
            rounded-lg shadow-lg transition'
            whileHover={{scale: 1.05}}
             whileTap={{scale:0.95}}
            >
             {slides[current].button}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className='absolute bottom-6 flex gap-4'>
        {
          slides.map((slide, index) =>(
            <motion.div 
            whileHover={{scale: 1.1}}
            className={`relative w-20 h-12 cursor-pointer rounded-lg overflow-hidden
               border-2 transition-all duration-300 ${index === current
                ? "border-gray-100 shadow-[0_0_10px_rgba(59, 130, 246, 0.8)]"
                :"border-gray-500 hover:border-[#00684D]"
               }`}>
                <Image src={slide.image} alt={slide.title} fill
                className='object-cover opacity-90'/>
            </motion.div>
          ))
        }
      </div>
    </div>
  )
}

export default Slider
