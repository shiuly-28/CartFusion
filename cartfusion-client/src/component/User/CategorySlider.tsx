"use client"
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { 
  Shirt, 
  Smartphone, 
  Home, 
  Sparkles, 
  Baby, 
  ShoppingBasket, 
  Dumbbell, 
  Car, 
  Gift, 
  BookOpen 
} from 'lucide-react';

// 🌟 categories অ্যারে কম্পোনেন্টের বাইরে রাখা ভালো
const categories = [
  { label: "Fashion & LifeStyle", icon: Shirt },
  { label: "Electronics & Gadgets", icon: Smartphone },
  { label: "Home & Living", icon: Home },
  { label: "Beauty & Personal care", icon: Sparkles },
  { label: "Toys, Kids & Baby", icon: Baby },
  { label: "Food & Grocery", icon: ShoppingBasket },
  { label: "Sports & Fitness", icon: Dumbbell },
  { label: "Automotive Accessories", icon: Car },
  { label: "Gift Handcrafts", icon: Gift },
  { label: "Books & Stationery", icon: BookOpen },
];

function CategorySlider() {
  const [startIndex, setStartIndex] = useState(0); // 🌟 State setter ঠিক করা হয়েছে

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className='relative w-full mx-auto bg-gradient-to-br from-black via-gray-900 to-black p-8 text-center'
    >
      <h2 className='text-3xl font-semibold mb-6 text-white'>Shop by Categories</h2>
      
      <div className='relative overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={startIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'
          >
            {categories.slice(startIndex, startIndex + 5).map((item) => {
              const Icon = item.icon; // 🌟 Icon component আলাদা ভ্যারিয়েবলে স্টোর করা হলো

              return (
                <motion.div
                  key={item.label} // 🌟 Unique key দেওয়া হলো
                  whileHover={{ scale: 1.08 }}
                  className='bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer text-white flex flex-col items-center justify-center'
                >
                  <Icon className='w-9 h-9 mb-2 text-[#049770]' /> {/* 🌟 Lucide Icon সঠিকভাবে রেন্ডার করা হয়েছে */}
                  <p className='text-sm font-medium'>{item.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CategorySlider;