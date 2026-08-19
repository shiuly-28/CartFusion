"use client"

import { IUser } from '@/model/user.model'
import { span } from 'motion/react-client'
import { useRouter } from 'next/navigation'
import React from 'react'

function Footer({ user }: { user: IUser }) {
    const role = user?.role
    const isUser = role == "user"
    const isAdminOrMerchant = role == "admin" || role == "merchant"
    const router = useRouter()
  return (
    <div className='bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] w-full text-gray-300 z-40
    py-12 border-t border-gray-700'>
    <div className={`max-w-7xl mx-auto px-6 grid gap-10 text-center md:text-left
        ${isUser ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : 
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
            <div className='space-y-3'>
                <h1 className='text-white text-3xl font-bold cursor-pointer
                tracking-wide hover:text-[#00684D] transition' onClick={() => router.push("/")}>Cartfusion</h1>
                <p className='text-sm leading-relaxed text-gray-400'>Smart, secure & scalable cart-merchant eCommerce platform build for
                     performance and growth.</p>
                     {isAdminOrMerchant && <span className={`inline-block mt-2 text-[11px] px-3 py-1
                        rounded-full text-white
                        ${role == "admin" ? "bg-[#00684D]" : "bg-[#018562]"}`}>
                            {role == "admin" ? "Admin Pannel" : "Merchant Pannel"}
                            </span>}
        </div>
        {isUser && <div>
            <h3 className='text-white text-lg fint-semibold mb-4'>Help & Support</h3>
            <ul className='space-y-2 text-sm'>
                <li className='cursor-pointer hover:text-white' onClick={() => router.push("/")}>Home</li>
                <li className='cursor-pointer hover:text-white' onClick={() => router.push("/category")}>Categories</li>
                <li className='cursor-pointer hover:text-white' onClick={() => router.push("/shop")}>Shop</li>
                <li className='cursor-pointer hover:text-white' onClick={() => router.push("/orders")}>Orders</li>
            </ul>
        </div>}
        {isUser && <div>
            <h3 className='text-white text-lg fint-semibold mb-4'>Quick LInks</h3>
            <ul className='space-y-2 text-sm'>
                <li className='cursor-pointer hover:text-white' onClick={() => router.push("/support")}>Support</li>
                <li className='cursor-pointer hover:text-white' onClick={() => router.push("/orders")}>Track-Orders</li>
               
            </ul>
        </div>}
        <div cl>

        </div>
    </div>
    </div>
  )
}

export default Footer
