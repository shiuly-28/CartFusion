"use client"

import React, { useState } from 'react'
import {  AnimatePresence, motion } from "motion/react"
function AddMerchantProduct() {

  const categories = [
   "Fashion & LifeStyle", 
  "Electronics & Gadgets", 
  "Home & Living", 
   "Beauty & Personal care", 
  "Toys, Kids & Baby", 
   "Food & Grocery", 
   "Sports & Fitness", 
  "Automotive Accessories",
  "Gift Handcrafts", 
"Books & Stationery",
];

const sizeOption = ["XS", "S", "M", "L", "XL", "XXL"]

const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [stock, setStock] = useState("")
const [price, setPrice] = useState("")
const [category, setSCategory] = useState("")
const [customCategory, setSCustomCategory] = useState("")

  return (
    <div  className='min-h-screen  bg-linear-to-br from-gray-900 
    via-black to-gray-900 text-white px-4 pt-20 pb-10'>
      <motion.div 
      initial={{ opacity: 0, y:-40 }}
      animate={{ opacity: 1, y:0 }}
      transition={{duration:0.5}}
      className='max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-6 sm:p-10 rounded-2xl 
      border border-white/20 shadow-xl'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Add New Product</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <input type="text"
          onChange={(e)=>setTitle(e.target.value)} value={title}
          className='p-3 bg-white/10 border border-white/20 rounded' placeholder='Product title'/>

          <input type="number"
          onChange={(e)=>setPrice(e.target.value)} value={price}
          className='p-3 bg-white/10 border border-white/20 rounded' placeholder='Product Price'/>

          <input type="number"
          onChange={(e)=>setStock(e.target.value)} value={stock}
          className='p-3 bg-white/10 border border-white/20 rounded' placeholder='Stock Quantity'/>

          <select
          onChange={(e)=>setSCategory(e.target.value)} value={title}
           className='p-3 bg-white/10 border border-white/20 rounded text-white'>
          <option className="bg-gray-800" value="">Select Category </option>
            {categories.map((cat)=>(
              <option key={cat} className='bg-gray-900' value={cat}>{cat}</option>
            ))}
         

          </select>
        </div>
      </motion.div>
    </div>
  )
}

export default AddMerchantProduct
