"use client"
import React from 'react'
import { motion } from 'motion/react'

function CategorySlider() {
const categories = [
    {label: "Fashion & LifeStyle", icon: },
    {label: "Electronics & Gadgets", icon: },
    {label: "Home & Living", icon: },
    {label: "Beauty & Personal care", icon: },
    {label: "Toys, Kids & Baby", icon: },
    {label: "Food & Grocery", icon: },
    {label: "Sports & Fitness", icon: },
    {label: "Automotive Accessories", icon: },
    {label: "Gift Handcrafts", icon: },
    {label: "Books & Stationery", icon: },
]
  return (
   <motion.div
   initial={{opacity: 0, y: 60 }}
   transition={{duration: 0.8 }}
   viewport={{once: true }}
   className='relative w-full mx-auto bg-gradient-to-br from-black
    via-gray-900 to-b bg-black p-8 text-center'
   >
    <h2 className='text-3xl font-semibold mb-6 text-white'>Shop by Categories</h2>
   </motion.div>
  )
}

export default CategorySlider
