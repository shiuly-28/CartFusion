"use client"

import React, { useEffect, useState } from 'react'
import {  AnimatePresence, motion } from "motion/react"
import { FiUpload } from 'react-icons/fi';
import Image from 'next/image';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
function UpdateProduct() {

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

const params = useParams()
const productId = params.id as string;

const {allProductData} = useSelector((state:RootState) =>state.merchant)

const  product = allProductData?.find((p)=>String(p._id) === String(productId))
console.log(product)

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

const [detailsPoints, setDetailsPoint] = useState<string[]>([])
const [currentPoint, setCurrentPoint] = useState("")
const [pointIndex, setPointIndex] = useState(0)
const [loading, setLoading] = useState(false)
const router = useRouter()


useEffect(()=>{
if(!product) return;

setTitle(product.title);
setDescription(product.description);
setPrice(String(product.price))
setStock(String(product.stock))
setCategory(product.category);

setIsWearable(Boolean(product.isWearable));
setSizes(product.size || []);

setReplacementDays(
    product.replacementDays ? String(product.replacementDays) : ""
)
setFreeDelivery(Boolean(product.freeDelivery));
setWarranty(product.warranty || "");
setPayOnDelivery(Boolean(product.payOnDevelivery));

setDetailsPoint(product.detailsPoint || []);
setPointIndex(product.detailsPoint?.length || 0);

setPreview1(product.image1);
setPreview2(product.image2)
setPreview3(product.image3)
setPreview4(product.image4)
},[])

const toggleSize = (size:string)=>{
setSizes((prev)=>prev.includes(size)
?prev.filter((s)=> s !==size) : [...prev, size]);
}

const handleAddPoint = () => {
  if(!currentPoint.trim())return;

  setDetailsPoint((prev) =>{
    const updated = [...prev]
    updated[pointIndex] = currentPoint;
    return updated;
  })
  setCurrentPoint("")
  setPointIndex((prev)=>prev+ 1)

 
}
 const handleRemove = (i:number)=>{
    setDetailsPoint((prev)=>prev.filter((_,index)=> index !== i))
  }

  const handleSubmit = async () =>{
    if(!title || !description || !price || !stock || !category || !image1 || !image2 || !image3 || !image4){
      alert("All feilds & images are required")
      return;
    }
    if(isWearable && sizes.length === 0){
       alert("All feilds & images are required")
      return;
    }
    setLoading(true)

     const formData = new FormData()
     formData.append("title", title);
     formData.append("description", description);
     formData.append("price", price);
     formData.append("stock", stock);
     formData.append(
      "category", 
      category === "Others" ? customCategory : category
     );

     formData.append("isWearable", String(isWearable));
     sizes.forEach((size) => formData.append("sizes", size));

     formData.append("replacementDays", replacementDays);
     formData.append("freeDelivey", String(freeDelivey));
     formData.append("warranty", warranty)
     formData.append("payOnDelivey", String(payOnDelivey));
     detailsPoints.forEach((point)=>
    formData.append("detailPoints", point)
    );

    if(image1 && image2 && image3 && image4){
      formData.append("image1", image1)
      formData.append("image2", image2)
      formData.append("image3", image3)
      formData.append("image4", image4)
    }
    try{
      const result = await axios.post("/api/merchant/addProduct", formData)
      console.log(result.data)
      setLoading(false)
      alert("✅ Product added successfully. Waiting for admin approval");
      router.push("/")
    }catch(error){
      setLoading(false)
      console.log("ADD PRODUCT ERROR:", error);
      alert("❌ product add failed");
    }
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
        <button type='button' className={`px-4 py-1 rounded-full border  ${
          size.includes(size)
          ?"bg-[#00684D] hover:bg-[#045f47]"
          : "bg-white/10 border-white/20"
        }`}
         onClick={()=>toggleSize(size)} key={size}>{size}</button>
      ))}
    </div>
    </div>}

    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
      <input type="text" className='p-3 bg-white/10 border border-white/20 rounded
      focus:outline-none focus:ring-2 focus:ring-[#00684D]'
       placeholder='Replacements(e.g. 7 days)'
       onChange={(e)=>setReplacementDays(e.target.value)}
       value={replacementDays}/>

      <input type="text" className='p-3 bg-white/10 border border-white/20 rounded
      focus:outline-none focus:ring-2 focus:ring-[#00684D]'
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
        <label htmlFor='img4'
        className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center
        border border-white/20'>
          {preview4 ? (
            <Image src={preview4} alt='img' width={120} height={120}
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

  <div className='mt-6'>
    <p className='font-semibold mb-2'>Product Details Points</p>
    <div className='flex gap-2'>
      <input type="text" className='flex-1 p-3 bg-white/10 border border-white/20
       rounded focus:outline-none focus:ring-2 focus:ring-[#00684D]'
        placeholder={`Point ${pointIndex + 1}`} onChange={(e)=>setCurrentPoint(e.target.value)} 
        value={currentPoint} />
      <button type='button' className='px-4 bg-[#00684D] hover:bg-[#045f47] rounded
       font-semibold' onClick={handleAddPoint}>Add Point</button>
    </div>
    {detailsPoints.length> 0 && (
      <ul className='mt-3 space-y-2'>
        {detailsPoints.map((point,index)=>(
          <li key={index} className='flex justify-between items-center bg-white/10 p-2 rounded'>
           <span className='text-sm'>{index + 1}  {point}</span>
           <button type='button' className='text-red-400 text-xs' onClick={()=>handleRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
    )}
  </div>
  <motion.button
   whileHover={{scale:1.02}}
    whileTap={{scale:0.97}}
    onClick={handleSubmit}
    disabled={loading}
   className='w-full mt-8 bg-[#00684D] hover:bg-[#045f47] py-3 rounded-lg font-semibold'
   >{loading? <ClipLoader size={20} color='white'/>: "Update Product"}</motion.button>
  </motion.div>
    </div>
  )
}

export default UpdateProduct
