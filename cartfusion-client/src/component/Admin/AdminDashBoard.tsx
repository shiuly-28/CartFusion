
"use client"
import React from 'react'
import { FaBox, FaCheckCircle, FaShoppingBag, FaStore } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { motion, } from 'motion/react'

function AdminDashBoard() {
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} /> },
    { id: "merchant", label: "Merchant Details", icon: <FaStore size={22} /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag size={22} /> },
    { id: "merchant-approval", label: "Merchant-approval", icon: <FaCheckCircle size={22} /> },
    { id: "product-approval", label: "product-approval", icon: <FaBox size={22} /> },
  ]

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white p-6'>
      <motion.div
       initial = {{ x: -40, opacity: 0}}
        animate={{x:0, opacity: 1}}
        transition={{duration: 0.4 }}
      className='hidden lg:block w-72 bg-gray-800/40 border-r border-gray-700 p-6 backdrop-blur-xl'
      >
        <h1 className='text-xl font-bold mb-6'>Admin Pannel</h1>
        <div></div>
      </motion.div>
    </div>
  )
}

export default AdminDashBoard
