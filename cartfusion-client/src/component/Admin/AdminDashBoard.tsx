
"use client"
import React, { useState } from 'react'
import { FaBox, FaCheckCircle, FaShoppingBag, FaStore } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { motion, } from 'motion/react'
import { button } from 'motion/react-client'

function AdminDashBoard() {
  const [activePage, setActivePage] = useState("dashboard")
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} /> },
    { id: "merchant", label: "Merchant Details", icon: <FaStore size={22} /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag size={22} /> },
    { id: "merchant-approval", label: "Merchant-approval", icon: <FaCheckCircle size={22} /> },
    { id: "product-approval", label: "product-approval", icon: <FaBox size={22} /> },
  ]

  return (
    <div className='w-full min-h-screen flex  bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white  mt-10'>
      <motion.div
       initial = {{ x: -40, opacity: 0}}
        animate={{x:0, opacity: 1}}
        transition={{duration: 0.4 }}
      className='hidden lg:block w-72 bg-gray-800/40 border-r border-gray-700 p-6 backdrop-blur-xl'
      >
        <h1 className='text-xl font-bold mb-6'>Admin Pannel</h1>
        <div className='flex flex-col gap-3'>
          {
              menu.map((item) => (
                <button key={item.id}
              onClick={()=> setActivePage(item.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm
                  ${
                    activePage === item.id
                    ? "bg-[#00684D] text-white"
                    :"bg-gray-800 hover:bg-gray-700"
                  }`}>

                    {item.icon}{item.label}

                </button>
              ))
          }
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashBoard
