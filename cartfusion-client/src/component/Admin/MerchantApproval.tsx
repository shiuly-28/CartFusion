"use client"

import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import { AnimatePresence, motion } from 'motion/react'
import { div, tr } from 'motion/react-client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function MerchantApproval() {
  const allMerchantData: IUser[] = useSelector((state:RootState)=>state.merchant.AllMerchantData)
  const pendingMerchant = Array.isArray(allMerchantData)?
    allMerchantData.filter((v)=>v.verificationStatus === "pending") : []

    const [selectedMerchant, setSelectedMerchant] = useState<IUser | null>(null)
  

    console.log(pendingMerchant)
  return (
      <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
        <h1 className='tex-xl sm:text-xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-white'>Merchant Approval Request</h1>
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
            {pendingMerchant.length === 0 ? (
              <tr>
              <td colSpan={5} className='p-6 text-center text-gray-400'>
                No Merchant Approval requests found
              </td>
              </tr>
            ) : (
             pendingMerchant.map((merchant, index) => (
              <tr key={index} className='border-t border-white/10 hover:bg-white/5'>
                <td className='p-4'>{merchant?.name}</td>
                <td className='p-4'>{merchant?.shopName || "-"}</td>
                <td className='p-4'>{merchant?.phone || "-"}</td>
                <td className='p-4'><span className='px-3 py-1 rounded-full text-xs bg-yellow-500/50 text-yellow-300'>
                {merchant.verificationStatus}</span></td>
                <td className='p-4 text-center'>
                  <button
                  onClick={() =>setSelectedMerchant(merchant)}
                  className='px-4 py-1 rounded-md bg-[#00684D] hover:bg-[#045f47]'>Check Details</button>
                </td>
              </tr>
             ))
            )}
          </tbody>
        </table>
      </div>
      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
            {pendingMerchant.length === 0 ?(
              <div className='text-center text-gray-400 mt-10'>
                No Merchant Approval requests found
              </div>
            ) : (
             pendingMerchant.map((merchant, index) => (
               <div key={index} className='bg-white/10 border border-white/20 rounded-xl p-4 space-y-2'>
                <div className='flex justify-between items-center'>
                  <h3 className='font-semibold text-lg'>{merchant?.name}</h3>
                  <span className='px-3 py-1 rounded-full text-xs bg-yellow-500/50
                  text-yellow-300'>{merchant?.verificationStatus}</span>
                </div>
                <p className='text-sm text-gray-300'>
                  <b>Shop:</b>{" "}{merchant.shopName}
                </p>
                <p className='text-sm text-gray-300'>
                  <b>Phone:</b>{" "}{merchant.shopName}
                </p>
                <button className='w-full mt-3 bg-[#00684D] hover:bg-[#045f47]
                text-sm py-2 rounded-lg' onClick={() => setSelectedMerchant(merchant)}>Check Details</button>
               </div>
             ))
            )}
      </div>
      <AnimatePresence>
        {selectedMerchant && (
          <motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MerchantApproval
