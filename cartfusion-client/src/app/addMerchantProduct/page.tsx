"use client"

import React, { useState } from 'react'
import {  AnimatePresence, motion } from "motion/react"
import { button } from 'motion/react-client';
import { FiUpload } from 'react-icons/fi';
import Image from 'next/image';
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
 "Others"
];

const sizeOption = ["XS", "S", "M", "L", "XL", "XXL"]

const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [stock, setStock] = useState("")
const [price, setPrice] = useState("")
const [category, setCategory] = useState("")
const [customCategory, setCustomCategory] = useState("")
const [isWearable, setIsWearable] = useState(false)
const [sizes, setSizes] = useState<string[]>([])
const [replacementDays, setReplacementDays] = useState("")
const [warranty, setWarranty] = useState("")
const [freeDelivey, setFreeDelivery] = useState(false)
const [payOnDelivey, setPayOnDelivery] = useState(false)

const [image1, setImage1] = useState<File | null>(null)
const [image2, setImage2] = useState<File | null>(null)
const [image3, setImage3] = useState<File | null>(null)
const [image4, setImage4] = useState<File | null>(null)

const [preview1, setPreview1] = useState<string | null>(null)
const [preview2, setPreview2] = useState<string | null>(null)
const [preview3, setPreview3] = useState<string | null>(null)
const [preview4, setPreview4] = useState<string | null>(null)

const toggleSize = (size:string)=>{
setSizes((prev)=>prev.includes(size)
?prev.filter((s)=> s !==size) : [...prev, size]);
}

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
          className='focus:outline-none focus:ring-2 focus:ring-[#00684D] p-3 bg-white/10 border border-white/20 rounded' placeholder='Product title'/>

          <input type="number"
          onChange={(e)=>setPrice(e.target.value)} value={price}
          className='focus:outline-none focus:ring-2 focus:ring-[#00684D] p-3 bg-white/10 border border-white/20 rounded' placeholder='Product Price'/>

          <input type="number"
          onChange={(e)=>setStock(e.target.value)} value={stock}
          className='focus:outline-none focus:ring-2 focus:ring-[#00684D] p-3 bg-white/10 border border-white/20 rounded' placeholder='Stock Quantity'/>

          <select
          onChange={(e)=>setCategory(e.target.value)} value={category}
           className='focus:outline-none focus:ring-2 focus:ring-[#00684D] p-3 bg-white/10 border border-white/20 rounded text-white'>
          <option className="bg-gray-800" value="">Select Category </option>
            {categories.map((cat)=>(
              <option key={cat} className='bg-gray-900' value={cat}>{cat}</option>
            ))}
         </select>
        </div>
        {category === "Others" && (
  <input 
    type='text' 
    className='focus:outline-none focus:ring-2 focus:ring-[#00684D] mt-4 w-full p-3 bg-white/10 border border-white/20 rounded' 
    placeholder='Enter Custom Category'
    onChange={(e) => setCustomCategory(e.target.value)} 
    value={customCategory}
  />)}
  <textarea placeholder='Product Description' className='focus:outline-none focus:ring-2 focus:ring-[#00684D] mt-4 w-full p-3 bg-white/10 border border-white/20 rounded '
  rows={3}   onChange={(e) => setDescription(e.target.value)} value={description}
  />

  <div className='flex items-center gap-3 mt-5'>
   <input type="checkbox" className='w-5 h-5'
    checked={isWearable} onChange={()=>setIsWearable(!isWearable)}/>
   <span className='text-sm'>This is weareable / clothing product</span>
  </div>

  {isWearable &&
   <div className='mt-4'>
    <p className='mb-2 text-sm font-semibold'>Select Sizes</p>
    <div>
      {sizeOption.map((size) =>(
        <button className={`px-4 py-1 rounded-full border  ${
          size.includes(size)
          ?"bg-[#00684D] hover:bg-[#045f47]"
          : "bg-white/10 border-white/20"
        }`}
         onClick={()=>toggleSize(size)} key={size}>{size}</button>
      ))}
    </div>
    </div>}

    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
      <input type="text" className='p-3 bg-white/10 border border-white/20 rounded'
       placeholder='Replacements(e.g. 7 days)'
       onChange={(e)=>setReplacementDays(e.target.value)}
       value={replacementDays}/>

      <input type="text" className='p-3 bg-white/10 border border-white/20 rounded'
       placeholder='Warranty(e.g. 1 years)'
       onChange={(e)=>setWarranty(e.target.value)}
       value={warranty}/>
    </div>
     <div className='flex items-center gap-3 mt-5'>
   <input type="checkbox" className='w-5 h-5'
    checked={freeDelivey} onChange={()=>setFreeDelivery(!freeDelivey)}/>
   <span className='text-sm'>Free Delivery</span>

   <input type="checkbox" className='w-5 h-5 ml-4'
    checked={payOnDelivey} onChange={()=>setPayOnDelivery(!payOnDelivey)}/>
   <span className='text-sm'>Pay On Delivery</span>
  </div>
  <h3 className='mt-6 mb-3 font-semibold'>Upload 4 Images</h3>
  <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
      {/* image1 */}
      <div>
        <input type="file" hidden id='img1' accept='image/*'
        onChange={(e)=>{
          const file = e.target.files?.[0];
          if(!file){return}
          setImage1(file)
          setPreview1(URL.createObjectURL(file))
        }} />
        <label htmlFor='img1'
        className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center
        border border-white/20'>
          {preview1 ? (
            <Image src={preview1} alt='img1' width={120} height={120}
            className="w-full h-full object-cover rounded"/>
          ) :(
            <div className='flex flex-col items-center text-gray-400 text-xs'>
              <FiUpload size={22}/>
              <span>Image 1</span>
            </div>
          )}
        </label>
      </div>
      {/* image2 */}
      <div>
        <input type="file" hidden id='img2' accept='image/*'
        onChange={(e)=>{
          const file = e.target.files?.[0];
          if(!file){return}
          setImage2(file)
          setPreview2(URL.createObjectURL(file))
        }} />
        <label htmlFor='img2'
        className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center
        border border-white/20'>
          {preview2 ? (
            <Image src={preview2} alt='img1' width={120} height={120}
            className="w-full h-full object-cover rounded"/>
          ) :(
            <div className='flex flex-col items-center text-gray-400 text-xs'>
              <FiUpload size={22}/>
              <span>Image 2</span>
            </div>
          )}
        </label>
      </div>
      {/* image3 */}
      <div>
        <input type="file" hidden id='img3' accept='image/*'
        onChange={(e)=>{
          const file = e.target.files?.[0];
          if(!file){return}
          setImage3(file)
          setPreview3(URL.createObjectURL(file))
        }} />
        <label htmlFor='img3'
        className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center
        border border-white/20'>
          {preview3 ? (
            <Image src={preview3} alt='img1' width={120} height={120}
            className="w-full h-full object-cover rounded"/>
          ) :(
            <div className='flex flex-col items-center text-gray-400 text-xs'>
              <FiUpload size={22}/>
              <span>Image 3</span>
            </div>
          )}
        </label>
      </div>
      {/* image4 */}
      <div>
        <input type="file" hidden id='img4' accept='image/*'
        onChange={(e)=>{
          const file = e.target.files?.[0];
          if(!file){return}
          setImage4(file)
          setPreview4(URL.createObjectURL(file))
        }} />
        <label htmlFor='img1'
        className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center
        border border-white/20'>
          {preview4 ? (
            <Image src={preview4} alt='img1' width={120} height={120}
            className="w-full h-full object-cover rounded"/>
          ) :(
            <div className='flex flex-col items-center text-gray-400 text-xs'>
              <FiUpload size={22}/>
              <span>Image 4</span>
            </div>
          )}
        </label>
      </div>
  </div>

  <div></div>
  </motion.div>
    </div>
  )
}

export default AddMerchantProduct
