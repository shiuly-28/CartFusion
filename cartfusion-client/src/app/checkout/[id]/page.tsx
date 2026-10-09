/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image';
import { FaStripe, FaCheck, FaBoxOpen } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

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
  const [loading, setLoading] = useState(false)

  // 🟢 পপআপের জন্য স্টেট
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

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
      <div className='min-h-screen bg-slate-950 text-4xl text-white flex items-center justify-center font-semibold'>
        <ClipLoader size={40} color='#00684D'/>
      </div>
    )
  }

  const productTotal = item.product.price * item.quantity
  const deliveryCharge = item.product.freeDelivery ? 0 : 50;
  const serviceCharge = 30;
  const finalTotal = productTotal + deliveryCharge + serviceCharge
  const codDisabled = !item.product.payOnDevelivery

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address || !city || !pincode){
      alert("Please fill all address fields");
      return;
    }

    const payload = {
      productId,
      quantity: item.quantity,
      address: { name, phone, address, city, pincode },
      amount: finalTotal,
      deliveryCharge,
      serviceCharge
    }
    
    setLoading(true)
    try {
      if (paymentMethod === "cod") {
        await axios.post("/api/order/cod", payload)
        // 🟢 রিডাইরেক্ট না করে পপআপ ওপেন করা হচ্ছে
        setIsSuccessModalOpen(true)
      } else {
        const result = await axios.post("/api/order/online-pay", payload)
        if (result.data?.url) {
          window.location.href = result.data.url
        }
      }
    } catch (error: any) {
      console.log(error)
      alert(error.response?.data?.message || "Checkout failed")
      router.push("/order-failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4 sm:px-6 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-5xl bg-white border border-gray-200 rounded-2xl p-6 shadow-xl md:p-10 grid md:grid-cols-2 gap-8'
      >
        {/* Left Column: Address Form */}
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-gray-800'>Delivery Address</h2>
          
          <input 
            type="text" 
            placeholder='Full Name' 
            className='w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] transition' 
            onChange={(e) => setName(e.target.value)} 
            value={name}
          />
          
          <input 
            type="text" 
            placeholder='Phone Number' 
            className='w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] transition' 
            onChange={(e) => setPhone(e.target.value)} 
            value={phone}
          />

          <textarea 
            placeholder='Complete Address' 
            rows={3}
            className='w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] transition' 
            onChange={(e) => setAddress(e.target.value)} 
            value={address}
          />

          <div className='grid grid-cols-2 gap-4'>
            <input 
              type="text" 
              placeholder='City' 
              className='w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] transition' 
              onChange={(e) => setCity(e.target.value)} 
              value={city}
            />

            <input 
              type="text" 
              placeholder='Pincode' 
              className='w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D] transition' 
              onChange={(e) => setPincode(e.target.value)} 
              value={pincode}
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Payment */}
        <div className='space-y-5'>
          <h2 className='text-2xl font-bold text-gray-800'>Order Summary</h2>
          
          <div className='flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200'>
            <div className='relative h-20 w-20 shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200'>
              <Image 
                src={item.product.image1} 
                alt={item.product.title || 'Product Image'} 
                fill 
                className='object-cover'
                sizes="80px"
              />
            </div>

            <div className='flex-1'>
              <p className='font-semibold text-gray-800 line-clamp-1'>{item.product.title}</p>
              <p className='text-sm text-gray-500 font-medium'>Qty: {item.quantity}</p>
            </div>
            <p className='font-bold text-[#00684D] text-lg'>৳ {productTotal}</p>
          </div>

          <div className='space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200'>
            <div className='flex justify-between'>
              <span>Delivery Charge</span>
              <span>৳ {deliveryCharge}</span>
            </div>
            <div className='flex justify-between'>
              <span>Service Charge</span>
              <span>৳ {serviceCharge}</span>
            </div>
            <div className='flex justify-between text-lg font-bold border-t border-gray-200 text-gray-900 pt-2 mt-2'>
              <span>Total</span>
              <span className='text-[#00684D]'>৳ {finalTotal}</span>
            </div>
          </div>

          <div className='space-y-3'>
            <p className='font-semibold text-gray-800'>Payment Method</p>
            <div className='flex gap-3'>
              <motion.button
                whileHover={!codDisabled ? { scale: 1.02 } : {}}
                whileTap={!codDisabled ? { scale: 0.98 } : {}}
                disabled={codDisabled}
                onClick={() => setPaymentMethod("cod")} 
                className={`flex-1 py-3 rounded-xl font-semibold transition text-sm sm:text-base border ${
                  codDisabled
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : paymentMethod === "cod"
                    ? "bg-[#00684D] text-white border-[#00684D]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Cash On Delivery
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentMethod("stripe")}
                className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-sm sm:text-base border ${
                  paymentMethod === "stripe"
                    ? "bg-[#00684D] text-white border-[#00684D]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FaStripe className='text-2xl text-indigo-500'/>
                Stripe
              </motion.button>
            </div>
            {codDisabled && (
              <p className='text-xs text-red-500'>* Cash on delivery is not available for this product.</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlaceOrder} 
            disabled={loading}
            className='w-full bg-[#00684D] hover:bg-[#045f47] py-3.5 rounded-xl font-semibold text-base transition text-white text-center shadow-md disabled:opacity-50'
          >
            {loading ? (
              <ClipLoader size={20} color='white'/>
            ) : paymentMethod === "cod" ? (
              "Place Order"
            ) : (
              "Proceed to Secure Payment"
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* 🟢 WHITE THEME SUCCESS MODAL */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='w-full max-w-sm bg-white border border-gray-100 text-gray-900 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl'
            >
              {/* Green Circle Check Icon */}
              <div className='w-20 h-20 bg-[#00684D] rounded-full flex items-center justify-center mb-6 shadow-md'>
                <FaCheck className='text-white text-3xl' />
              </div>

              {/* Title */}
              <h3 className='text-2xl font-bold mb-3 tracking-wide text-gray-900'>
                Order Placed<br />Successfully
              </h3>

              {/* Package Icon */}
              <div className='my-2 text-[#00684D]'>
                <FaBoxOpen className='text-4xl' />
              </div>

              {/* Subtitle */}
              <p className='text-gray-600 text-sm mb-6 leading-relaxed'>
                Your order has been received and is now being processed
              </p>

              {/* Button */}
              <button
                onClick={() => router.push("/orders")}
                className='w-full bg-[#00684D] hover:bg-[#045f47] text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-md'
              >
                Go to Order Page
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Checkout