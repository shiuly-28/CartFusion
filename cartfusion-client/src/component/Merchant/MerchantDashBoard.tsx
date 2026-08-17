

"use client"
import React, { useState } from 'react'
import { FaShoppingBag, FaStore } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { AnimatePresence, motion, } from 'motion/react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import Dashboard from './Dashboard'
import MerchantProduct from './MerchantProduct'
import MerchantOrders from './MerchantOrders'



function MerchantDashBoard() {
  const [activePage, setActivePage] = useState("dashboard")
  const [openMenu, setOpenMenu] = useState(false)

  const renderPage = () => {
    switch(activePage){
      case "dashboard" : return <Dashboard/>
      case "products" : return <MerchantProduct/>
      case "orders" : return <MerchantOrders/>
    
    }
  }
  const menu = [
    { id: "dashboard", label: "Merchant Dashboard", icon: <MdDashboard size={22} /> },
    { id: "merchant", label: "Merchant Product", icon: <FaStore size={22} /> },
    { id: "orders", label: "Merchant Orders", icon: <FaShoppingBag size={22} /> },
  
  ]

  return (
    <div className='w-full min-h-screen flex bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white mt-10'>

      {/* mobile areA */}
      <div className='lg:hidden fixed top-15 flex left-0 w-full bg-black px-6 py-3 justify-between items-center
      border-b border-gray-700 z-50'>
        <h1 className='text-xl font-bold'>Merchant Pannel</h1>
        {!openMenu && <button onClick={()=> setOpenMenu(true)}><AiOutlineMenu size={24}/></button>}
      </div>

      {/* sidebar for large area */}
        <motion.div
        initial = {{ x: -40, opacity: 0}}
        animate={{x:0, opacity: 1}}
        transition={{duration: 0.4 }}
        className='hidden lg:block w-72 bg-gray-800/40 border-r border-gray-700 
        p-6 backdrop-blur-xl mt-4'
        >
          <h1 className='text-xl font-bold mb-6'>Merchant Pannel</h1>
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
{/* dgdf */}
        
        </motion.div>
     
      {/* sidebar for mobile */}

      <AnimatePresence>
        {
         openMenu &&  (<motion.div 
              initial = {{ x: -300}}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{duration: 0.3 }}
          className='lg:hidden fixed top-0 left-0 w-72 h-full bg-gray-800/90 backdrop-blur-xl p-6 py-3
          z-50 border-r border-gray-700 '>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-xl font-bold'>Merchant Pannel</h1>
            <button onClick={()=> setOpenMenu(false)}><AiOutlineClose size={24}/></button>
          </div>

            <div className='flex flex-col gap-3'>
          {
              menu.map((item) => (
                <button key={item.id}
              onClick={()=> {setOpenMenu(false); setActivePage(item.id)}}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm
                  ${
                    activePage === item.id
                    ? "bg-[#00684D] text-white"
                    :"bg-black/20 hover:bg-gray-700"
                  }`}>

                    {item.icon}{item.label}

                </button>
              ))
          }
        </div>
        </motion.div>)
        }
      </AnimatePresence>

      {/* main agea */}
      <motion.div
      initial= {{opacity: 0, z: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{duration: 0.4 }}
       className='flex-1 p-10 mt-16 lg:mt-0'>
        {renderPage()}
      </motion.div>
    </div>
  )
}

export default MerchantDashBoard;
