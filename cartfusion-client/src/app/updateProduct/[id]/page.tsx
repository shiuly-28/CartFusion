"use client"

import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { FiUpload } from 'react-icons/fi'
import Image from 'next/image'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const inputCls =
  'p-3 bg-white border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D]'

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
]

const sizeOption = ["XS", "S", "M", "L", "XL", "XXL"]

function UpdateProduct() {
  const params = useParams()
  const productId = params.id as string

  const { allProductData } = useSelector((state: RootState) => state.merchant)
  const product = allProductData?.find((p) => String(p._id) === String(productId))

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
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!product) return

    setTitle(product.title)
    setDescription(product.description)
    setPrice(String(product.price))
    setStock(String(product.stock))
    setCategory(product.category)

    setIsWearable(Boolean(product.isWearable))
    setSizes(product.size || [])

    setReplacementDays(
      product.replacementDays ? String(product.replacementDays) : ""
    )
    setFreeDelivery(Boolean(product.freeDelivery))
    setWarranty(product.warranty || "")
    setPayOnDelivery(Boolean(product.payOnDevelivery))

    setDetailsPoint(product.detailsPoint || [])

    setPreview1(product.image1)
    setPreview2(product.image2)
    setPreview3(product.image3)
    setPreview4(product.image4)
  }, [product])

  const toggleSize = (size: string) => {
    setSizes((prev) => prev.includes(size)
      ? prev.filter((s) => s !== size) : [...prev, size])
  }

  const handleAddPoint = () => {
    if (!currentPoint.trim()) return
    setDetailsPoint((prev) => [...prev, currentPoint])
    setCurrentPoint("")
  }

  const handleRemove = (i: number) => {
    setDetailsPoint((prev) => prev.filter((_, index) => index !== i))
  }

  const handleSubmit = async () => {
    if (isWearable && sizes.length === 0) {
      alert("Please select at least one size")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("productId", productId)
    formData.append("title", title)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("stock", stock)
    formData.append(
      "category",
      category === "Others" ? customCategory : category
    )

    formData.append("isWearable", String(isWearable))
    sizes.forEach((size) => formData.append("sizes", size))

    formData.append("replacementDays", replacementDays)
    formData.append("freeDelivey", String(freeDelivey))
    formData.append("warranty", warranty)
    formData.append("payOnDelivey", String(payOnDelivey))
    detailsPoints.forEach((point) =>
      formData.append("detailPoints", point)
    )

    if (image1 && image2 && image3 && image4) {
      formData.append("image1", image1)
      formData.append("image2", image2)
      formData.append("image3", image3)
      formData.append("image4", image4)
    }

    try {
      await axios.post("/api/merchant/updatedProduct", formData)
      setLoading(false)
      alert("✅ Product updated successfully. Waiting for admin approval")
      router.push("/")
    } catch (error) {
      setLoading(false)
      console.log("UPDATE PRODUCT ERROR:", error)
      alert("❌ product update failed")
    }
  }

  // one config per image slot, so the upload box is written only once
  const imageSlots = [
    { id: 'img1', label: 'Image 1', preview: preview1, setFile: setImage1, setPreview: setPreview1 },
    { id: 'img2', label: 'Image 2', preview: preview2, setFile: setImage2, setPreview: setPreview2 },
    { id: 'img3', label: 'Image 3', preview: preview3, setFile: setImage3, setPreview: setPreview3 },
    { id: 'img4', label: 'Image 4', preview: preview4, setFile: setImage4, setPreview: setPreview4 },
  ]

  return (
    <div className='min-h-screen bg-gray-50 text-gray-900 px-4 pt-20 pb-10'>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-lg'
      >
        <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Update Product</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <input type="text"
            onChange={(e) => setTitle(e.target.value)} value={title}
            className={inputCls} placeholder='Product title' />

          <input type="number"
            onChange={(e) => setPrice(e.target.value)} value={price}
            className={inputCls} placeholder='Product Price' />

          <input type="number"
            onChange={(e) => setStock(e.target.value)} value={stock}
            className={inputCls} placeholder='Stock Quantity' />

          <select
            onChange={(e) => setCategory(e.target.value)} value={category}
            className={inputCls}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {category === "Others" && (
          <input
            type='text'
            className={`mt-4 w-full ${inputCls}`}
            placeholder='Enter Custom Category'
            onChange={(e) => setCustomCategory(e.target.value)}
            value={customCategory}
          />
        )}

        <textarea
          placeholder='Product Description'
          className={`mt-4 w-full ${inputCls}`}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />

        {/* <div className='flex items-center gap-3 mt-5'>
          <input type="checkbox" className='w-5 h-5 accent-[#00684D]'
            checked={isWearable} onChange={() => setIsWearable(!isWearable)} />
          <span className='text-sm'>This is wearable / clothing product</span>
        </div> */}

        {/* {isWearable && (
          <div className='mt-4'>
            <p className='mb-2 text-sm font-semibold'>Select Sizes</p>
            <div className='flex flex-wrap gap-2'>
              {sizeOption.map((size) => (
                <button
                  type='button'
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-1 rounded-full border ${
                    sizes.includes(size)
                      ? "bg-[#00684D] hover:bg-[#045f47] border-[#00684D] text-white"
                      : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )} */}

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
          <input
            type="number"
            min={0}
            className={inputCls}
            placeholder='Replacement Days (e.g. 7)'
            onChange={(e) => setReplacementDays(e.target.value)}
            value={replacementDays}
          />

          <input type="text"
            className={inputCls}
            placeholder='Warranty(e.g. 1 years)'
            onChange={(e) => setWarranty(e.target.value)}
            value={warranty} />
        </div>

        <div className='flex items-center gap-3 mt-5'>
          <input type="checkbox" className='w-5 h-5 accent-[#00684D]'
            checked={freeDelivey} onChange={() => setFreeDelivery(!freeDelivey)} />
          <span className='text-sm'>Free Delivery</span>

          <input type="checkbox" className='w-5 h-5 ml-4 accent-[#00684D]'
            checked={payOnDelivey} onChange={() => setPayOnDelivery(!payOnDelivey)} />
          <span className='text-sm'>Pay On Delivery</span>
        </div>

        <h3 className='mt-6 mb-3 font-semibold'>Upload 4 Images</h3>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {imageSlots.map((slot) => (
            <div key={slot.id}>
              <input type="file" hidden id={slot.id} accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  slot.setFile(file)
                  slot.setPreview(URL.createObjectURL(file))
                }} />
              <label htmlFor={slot.id}
                className='cursor-pointer bg-gray-50 hover:bg-gray-100 p-2 rounded h-28 flex items-center justify-center border border-dashed border-gray-300'>
                {slot.preview ? (
                  <Image src={slot.preview} alt={slot.label} width={120} height={120}
                    className="w-full h-full object-cover rounded" />
                ) : (
                  <div className='flex flex-col items-center text-gray-500 text-xs'>
                    <FiUpload size={22} />
                    <span>{slot.label}</span>
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>

        <div className='mt-6'>
          <p className='font-semibold mb-2'>Product Details Points</p>
          <div className='flex gap-2'>
            <input type="text" className={`flex-1 ${inputCls}`}
              placeholder={`Point ${detailsPoints.length + 1}`}
              onChange={(e) => setCurrentPoint(e.target.value)}
              value={currentPoint} />
            <button type='button'
              className='px-4 bg-[#00684D] hover:bg-[#045f47] text-white rounded font-semibold'
              onClick={handleAddPoint}>Add Point</button>
          </div>
          {detailsPoints.length > 0 && (
            <ul className='mt-3 space-y-2'>
              {detailsPoints.map((point, index) => (
                <li key={index} className='flex justify-between items-center bg-gray-50 border border-gray-200 p-2 rounded'>
                  <span className='text-sm'>{index + 1}. {point}</span>
                  <button type='button' className='text-red-600 hover:text-red-700 text-xs'
                    onClick={() => handleRemove(index)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className='w-full mt-8 bg-[#00684D] hover:bg-[#045f47] text-white py-3 rounded-lg font-semibold'
        >
          {loading ? <ClipLoader size={20} color='white' /> : "Update Product"}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default UpdateProduct