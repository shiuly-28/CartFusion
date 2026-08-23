"use client"

import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import { tr } from 'motion/react-client'
import React from 'react'
import { useSelector } from 'react-redux'

function MerchantApproval() {
  const allMerchantData: IUser[] = useSelector((state:RootState)=>state.merchant.AllMerchantData)
  const pendingMerchant = Array.isArray(allMerchantData)?
    allMerchantData.filter((v)=>v.verificationStatus === "pending") : []
  

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
                  <button className='px-4 py-1 rounded-md bg-[#00684D] hover:bg-[#045f47]'>Check Details</button>
                </td>
              </tr>
             ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MerchantApproval
