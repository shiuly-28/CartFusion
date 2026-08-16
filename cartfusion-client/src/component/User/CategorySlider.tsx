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

// 🌟 categories অ্যারে কম্পোনেন্টের বাইরে রাখা ভালো (re-render এ আবার তৈরি হবে না)
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

// 🌟 direction অনুযায়ী slide animation variants
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

function CategorySlider() {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 🌟 1 = next (ডান থেকে আসবে), -1 = prev (বাম থেকে আসবে)

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
      className='relative w-full mx-auto bg-gradient-to-br from-black via-gray-900 to-black p-8 text-center'
    >
      <h2 className='text-3xl font-semibold mb-6 text-white'>Shop by Categories</h2>

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
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'
          >
            {categories.slice(startIndex, startIndex + 5).map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className='bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer text-white flex flex-col items-center justify-center'
                >
                  <Icon className='w-9 h-9 mb-2 text-[#049770]' />
                  <p className='text-sm font-medium'>{item.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={PrevSlice}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/60 text-white
          rounded-full p-2 border border-gray-500'
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={NextSlice}
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/60 text-white p-2
          rounded-full border border-gray-500'
        >
          <FaChevronRight />
        </button>
      </div>
    </motion.div>
  )
}

export default CategorySlider;