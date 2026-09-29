"use client"
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
import { useRouter } from 'next/navigation';


function CategorySlider() {
  const router = useRouter()
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0); 

  const NextSlice = () => {
    setDirection(1);
    setStartIndex((prev) => (prev + 5) % categories.length);
  };

  const PrevSlice = () => {
    setDirection(-1);
    setStartIndex((prev) => (prev - 5 < 0 ? categories.length - 5 : prev - 5));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setStartIndex((prev) => (prev + 5) % categories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className='relative w-full mx-auto bg-white px-4 md:px-10 py-8'
    >
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-900 tracking-tight'>Shop by Category</h2>

        <div className='flex gap-2'>
          <button
            onClick={PrevSlice}
            className='bg-white text-gray-700 rounded-full p-2 border border-gray-200 shadow-sm hover:bg-gray-50 transition'
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            onClick={NextSlice}
            className='bg-white text-gray-700 rounded-full p-2 border border-gray-200 shadow-sm hover:bg-gray-50 transition'
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className='relative overflow-hidden'>
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={startIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
          >
            {categories.slice(startIndex, startIndex + 5).map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  onClick={()=>router.push(`/category?category=${encodeURIComponent(item.label)}`)}
                  className='bg-gray-50 hover:bg-white border border-gray-100 hover:border-[#00684D]/30 hover:shadow-md p-6 rounded-2xl cursor-pointer text-gray-800 flex flex-col items-center justify-center transition'
                >
                  <div className='w-14 h-14 rounded-full bg-[#00684D]/10 flex items-center justify-center mb-3'>
                    <Icon className='w-7 h-7 text-[#00684D]' />
                  </div>
                  <p className='text-sm font-medium text-center'>{item.label}</p>
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