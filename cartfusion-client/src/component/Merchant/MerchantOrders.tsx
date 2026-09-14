"use client"

import UseGetAllMerchant from '@/hooks/UseGetAllMerchant'
import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser'
import { IUser } from '@/model/user.model'
import { setAllMerchantData } from '@/redux/merchantSlice'
import { AppDispatch, RootState } from '@/redux/store'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

function MerchantOrders() {
  const dispatch = useDispatch<AppDispatch>()
  UserGetCurrentUser()
  UseGetAllOrdersData()

  const {userData} = useSelector((state: RootState)=> state.user)
  const { allOrdersData } = useSelector((state:RootState)=>state.user)

   const orders =Array.isArray(allOrdersData)?
  allOrdersData.filter((o)=>String(o.productMerchant._id) === String(userData?._id)) : []


console.log(orders)

 

    

  return (
      <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
        <h1 className='tex-xl sm:text-xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-white'>Merchant Order</h1>
        <p className='text-gray-300'>{orders.length}</p>
      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
            <tr>
              <th className='p-4'>Merchant Name</th>
              <th className='p-4'>Shop Now</th>
              <th className='p-4'>Phone</th>
              <th className='p-4'>status</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
              <td colSpan={5} className='p-6 text-center text-gray-400'>
                No Merchant Approval requests found
              </td>
              </tr>
            ) : (
            orders.map((order, index) => (
              <tr key={index} className='border-t border-white/10 hover:bg-white/5'>
                
              </tr>
             ))
            )}
          </tbody>
        </table>
      </div>
      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
            {orders.length === 0 ?(
              <div className='text-center text-gray-400 mt-10'>
                No order found
              </div>
            ) : (
            orders.map((order, index) => (
               <div key={index} className='bg-white/10 border border-white/20 rounded-xl p-4 space-y-2'>
                
                 
               </div>
             ))
            )}
      </div>
      </div>
     


   
  )
}

export default MerchantOrders;
