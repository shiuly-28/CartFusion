"use client"

import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser'
import { RootState } from '@/redux/store'
import { AnimatePresence, motion} from 'motion/react'
import React from 'react'
import { FiTruck } from 'react-icons/fi'
import { useSelector } from 'react-redux'


function Orders() {
  UseGetAllOrdersData()
  UserGetCurrentUser()

  const {userData} = useSelector((state:RootState) => state.user)
  const {allOrdersData} = useSelector((state:RootState) => state.user)

  const orders =Array.isArray(allOrdersData)?
  allOrdersData.filter((o)=>String(o.buyer._id) === String(userData?._id)) : []


    const formateDate = (date:string)=> {
    if(!date)return;
    const d = new Date(date)
    return d.toLocaleString("en-IN",{
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  }

  


  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black
     to-gray-900 text-white '>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6 font-bold flex items-center justify-between'>
          <div className='mt-5'>
            <h1 className='text-2xl font-bold'>My Orders</h1>
            <p>All orders placed by you</p>
          </div>
          <div className='text-sm text-gray-300'>{orders.length} Orders</div>
        </div>
         {/* lg device */}
    <div className='hidden lg:block bg-white/5 border border-white/10
    rounded-xl overflow-auto shadow-xl shadow-black/40'>
      <table className='w-full text-left'>
        <thead className='text-xs bg-white/5 border border-white/10 text-gray-300 uppercase tracking-wide'>
          <tr>
            <th className='px-4 py-4'>Orders ID</th>
            <th className='px-4 py-4'>Date</th>
            <th className='px-4 py-4'>Products</th>
            <th className='px-4 py-4'>Merchant</th>
            <th className='px-4 py-4'>Payment</th>
            <th className='px-4 py-4'>Status</th>
            <th className='px-4 py-4 text-right'>Total</th>
            <th className='px-4 py-4 text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
  {
    orders.length !== 0 ? (
      orders.map((order, index) => (
        <tr 
          key={index}
          className='border-t border-white/5 hover:bg-white/10 transition-all duration-200'
        >
          <td className='px-4 py-4 text-sm'>#{String(order._id).slice(-8)}</td>
          <td className='px-4 py-4 text-sm'>{formateDate(String(order.createAt))}</td>
          <td className='px-4 py-4 text-sm'>
            {order.products.map((p, i) => (
              <div key={i} className='text-gray-200'>{p.product.title} * {p.quantity}</div>
            ))}
          </td>
          <td className='px-4 py-4 text-sm'>{order.productMerchant.shopName}</td>
          <td className='px-4 py-4 text-sm'>
            {order.paymentMethod.toUpperCase()}
            <div className={`text-xs ${order.isPaid ? "text-[#00684D]" : "text-amber-400"}`}>
              {order.isPaid ? "paid" : "pending"}
            </div>
          </td>
          <td className='px-4 py-4 text-sm'>{order.orderStatus.toUpperCase()}</td>
          <td className='px-4 py-4 text-right text-[#00684D] font-semibold'>
            <span className='text-2xl'>৳</span>{order.totalAmount}
          </td>
          <td className='px-4 py-4 flex justify-center'>
            <div className='flex gap-2'>
              <button className='px-3 py-1 bg-[#00684D] rounded hover:bg-[#0ba57c]'>
                Check Details
              </button>
              <button className='px-3 flex gap-0.5 py-1 bg-white/10 justify-center items-center rounded hover:bg-white/20'>
                <FiTruck/><span>Track Order</span>
              </button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={8} className='text-center py-6 text-gray-400'>
          No orders found
        </td>
      </tr>
    )
  }
</tbody>
      </table>

    </div>
    <div className='lg:hidden space-y-4'>
        { orders.length !== 0 ? (
          orders.map((order, index)=>(
            <motion.div
            initial={{scale: 0.95, opacity: 0}}
            animate={{scale: 1, opacity: 1 }}
            transition={{duration: 0.4}}
            key={index} className='bg-white/5 border border-white/10 p-4 rounded-xl'>
              <div className='flex justify-between'>
                <div>
                  <div className='text-sm text-gray-300'>#{String(order._id).slice(-8)}</div>
                  <div className='font-semibold'>{formateDate(String(order.createAt))}</div>
                  <div className='text-sm text-gray-300 mt-1'>{order.productMerchant.shopName}</div>
                </div>
                <div className='text-[#00684D] font-bold text-right'>
                  <span className='text-2xl'>৳</span>{order.totalAmount}
                </div>
              </div>
              <div>
                <div>
                  <div className='text-sm text-gray-400'>Payment Method: {" "}{order.paymentMethod.toUpperCase()}</div>
                  <div className={`text-xs ${order.isPaid ? "text-[#00684D]" : "text-amber-400"}`}>{order.isPaid ? "paid" : "pending"}</div>
                </div>
                <div className='text-right'>
                  <div className='text-xs text-gray-400'>Status</div>
                  <div className='text-sm font-semibold'>{order.orderStatus}</div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (<motion.div
          initial={{scale: 0.95, opacity: 0}}
          animate={{scale: 1, opacity: 1 }}
          transition={{duration: 0.4}}
          className='text-xl text-center text-white bg-white/5
          border border-white/10 p-4 rounded-xl'>No Orders found</motion.div>)
        }
      </div>
      </div>
   

    </div>
  )
}

export default Orders;
