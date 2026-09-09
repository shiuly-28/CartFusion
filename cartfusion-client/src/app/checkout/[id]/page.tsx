"use client"
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image';

function Checkout() {
  const params = useParams()
  const productId = params.id as string;
  const [item, setItem] = useState<any>(null)
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")

  useEffect(() => {
    if (!productId) return;

    const loadItem = async () => {
      try {
        const result = await axios.get("/api/user/cart/get")
        const foundItem = result.data.cart?.find((i: any) => i.product?._id === productId)
        
        if (!foundItem) {
          router.replace("/cart")
          return;
        }

        setItem(foundItem)

        if (!foundItem.product?.payOnDevelivery) {
          setPaymentMethod("stripe")
        }
      } catch (error) {
        console.log(error)
        alert("Failed to get item")
      }
    }
    loadItem()
  }, [productId, router])

  if (!item) {
    return (
      <div className='min-h-screen bg-linear-to-br from-[#020617] via-black to-[#020617] text-4xl text-white flex items-center justify-center font-semibold'>
        Loading....
      </div>
    )
  }

  const productTotal = item.product.price * item.quantity
  const deliveryCharge = item.product.freeDelivery ? 0 : 50;
  const serviceCharge = 30;
  const finalTotal = productTotal + deliveryCharge + serviceCharge

  return (
    <div className='min-h-screen bg-linear-to-br from-[#020617] via-black to-[#020617] flex items-center justify-center px-6 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl md:p-10 grid md:grid-cols-2 gap-8'
      >
        <div className='space-y-5'>
          <h2 className='text-2xl font-bold text-white hover:text-[#00684D]'>Delivery Address</h2>
          <input 
            type="text" 
            placeholder='Full Name' 
            className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] hover:border-white/40 transition' 
            onChange={(e) => setName(e.target.value)} 
            value={name}
          />
          
          <input 
            type="text" 
            placeholder='Phone Number' 
            className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] hover:border-white/40 transition' 
            onChange={(e) => setPhone(e.target.value)} 
            value={phone}
          />

          <textarea 
            placeholder='Complete Address' 
            className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] hover:border-white/40 transition' 
            onChange={(e) => setAddress(e.target.value)} 
            value={address}
          />

          <div className='grid grid-cols-2 gap-4'>
            <input 
              type="text" 
              placeholder='City' 
              className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] hover:border-white/40 transition' 
              onChange={(e) => setCity(e.target.value)} 
              value={city}
            />

            <input 
              type="text" 
              placeholder='Pincode' 
              className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] hover:border-white/40 transition' 
              onChange={(e) => setPincode(e.target.value)} 
              value={pincode}
            />
          </div>
        </div>

        <div className='space-y-5'>
          <h2 className='text-2xl font-bold text-white hover:text-[#00684D]'>Order Summary</h2>
          <div className='flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10'>
            
            {/* Image Container with fixed height/width for fill attribute */}
            <div className='relative h-20 w-20 shrink-0 bg-white rounded-lg overflow-hidden'>
              <Image 
                src={item.product.image1} 
                alt={item.product.title || 'Product Image'} 
                fill 
                className='object-cover'
                sizes="80px"
              />
            </div>

            <div className='flex-1'>
              <p className='font-semibold text-gray-300'>{item.product.title}</p>
              <p className='font-bold text-gray-400'>Qty: {item.quantity}</p>
            </div>
            <p className='font-bold text-[#00684D] text-lg'>৳ {productTotal}</p>
          </div>

          <div className='space-y-2 text-sm text-gray-300'>
            <div className='flex justify-between'>
              <span>Delivery Charge</span>
              <span>৳ {deliveryCharge}</span>
            </div>
            <div className='flex justify-between'>
              <span>Service Charge</span>
              <span>৳ {serviceCharge}</span>
            </div>
            <div className='flex justify-between text-lg font-bold border-t border-white/20 text-white pt-2'>
              <span>Total</span>
              <span className='text-[#00684D]'>৳ {finalTotal}</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  )
}

export default Checkout