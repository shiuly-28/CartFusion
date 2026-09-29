"use client"

import { IUser } from '@/model/user.model'
import { useRouter } from 'next/navigation'
import React from 'react'

function Footer({ user }: { user?: IUser }) { // user optional রাখা ভালো
    const role = user?.role
    // 🟢 লগইন না থাকলে (!user) অথবা role "user" হলে কাস্টমার ভিউ দেখাবে
    const isCustomer = !user || role === "user" 
    const isAdminOrMerchant = role === "admin" || role === "merchant"
    const router = useRouter()

  return (
    <div className='bg-gray-50 w-full text-gray-600 z-40 py-12 border-t border-gray-200'>
      <div className={`max-w-7xl mx-auto px-6 grid gap-10 text-center md:text-left
        ${isCustomer ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : 
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
            
            {/* Logo & Info */}
            <div className='space-y-3'>
                <h1 className='text-gray-900 text-3xl font-bold cursor-pointer
                tracking-wide hover:text-[#00684D] transition' onClick={() => router.push("/")}>CartFusion</h1>
                <p className='text-sm leading-relaxed text-gray-500'>Smart, secure & scalable cart-merchant eCommerce platform built for
                    performance and growth.</p>
                     {isAdminOrMerchant && <span className={`inline-block mt-2 text-[11px] px-3 py-1
                        rounded-full text-white
                        ${role === "admin" ? "bg-[#00684D]" : "bg-[#018562]"}`}>
                            {role === "admin" ? "Admin Panel" : "Merchant Panel"}
                            </span>}
            </div>

            {/* Help & Support (Guest/Customer) */}
            {isCustomer && <div>
                <h3 className='text-gray-900 text-lg font-semibold mb-4'>Help & Support</h3>
                <ul className='space-y-2 text-sm'>
                    <li className='cursor-pointer hover:text-[#00684D] transition' onClick={() => router.push("/")}>Home</li>
                    <li className='cursor-pointer hover:text-[#00684D] transition' onClick={() => router.push("/category")}>Categories</li>
                    <li className='cursor-pointer hover:text-[#00684D] transition' onClick={() => router.push("/shop")}>Shop</li>
                    <li className='cursor-pointer hover:text-[#00684D] transition' onClick={() => router.push("/orders")}>Orders</li>
                </ul>
            </div>}

            {/* Quick Links (Guest/Customer) */}
            {isCustomer && <div>
                <h3 className='text-gray-900 text-lg font-semibold mb-4'>Quick Links</h3>
                <ul className='space-y-2 text-sm'>
                    <li className='cursor-pointer hover:text-[#00684D] transition' onClick={() => router.push("/support")}>Support</li>
                    <li className='cursor-pointer hover:text-[#00684D] transition' onClick={() => router.push("/orders")}>Track Orders</li>
                </ul>
            </div>}

            {/* Admin / Merchant Panel Card */}
            {isAdminOrMerchant && <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'>
                <h3 className='text-gray-900 text-lg font-semibold mb-3'>{role === "admin" ? "System Access" : "Vendor Dashboard"}</h3>
                <ul className='space-y-2 text-sm text-gray-500 mb-4'>
                    {role === "admin" ? (
                        <>
                        <li>✓ Platform Management</li>
                        <li>✓ Merchant Control</li>
                        <li>✓ Orders & Revenue</li>
                        <li>✓ System Security</li>
                        </>
                    ):(
                        <>
                        <li>✓ Product Upload & Edit</li>
                        <li>✓ Order & Delivery Tracking</li>
                        <li>✓ Sales & Profit Analytics</li>
                        <li>✓ Wallet & Settlement</li>
                        </>
                    )}
                </ul>
            </div>}

            {/* Contact Info */}
            <div className='space-y-2'>
                <h3 className='text-gray-900 text-lg font-semibold mb-4'>Contact Info</h3>
                <p className='text-sm text-gray-500'>admin@cartfusion.com</p>
                <p className='text-sm text-gray-500'>01757321528</p>
                <p className='text-sm text-gray-500'>Sylhet, Bangladesh</p>
            </div>
      </div>
      <div className='text-center text-xs text-gray-400 mt-12 border-t border-gray-200 pt-4'>
            © {new Date().getFullYear()} CartFusion - Powered by Secure Commerce Engine
      </div>
    </div>
  )
}

export default Footer