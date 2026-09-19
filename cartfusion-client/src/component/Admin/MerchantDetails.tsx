/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import UseGetAllMerchant from '@/hooks/UseGetAllMerchant'
import { IUser } from '@/model/user.model'
import { AppDispatch, RootState } from '@/redux/store'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

function MerchantDetails() {
  const dispatch = useDispatch<AppDispatch>()
  UseGetAllMerchant()

  const allMerchantData: IUser[] = useSelector((state:RootState)=>state.merchant.AllMerchantData)

  const ApprovedMerchant = Array.isArray(allMerchantData)?
    allMerchantData.filter((v)=>v.verificationStatus === "approved") : []

    const [selectedMerchant, setSelectedMerchant] = useState<IUser | null>(null)


  
  return (
      <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
        <h1 className='tex-xl sm:text-xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-white'>Merchant Approval Details</h1>
      {/* desktop table */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
            <tr>
              <th className='p-4 text-nowrap'>Merchant Name</th>
              <th className='p-4 text-nowrap'>Shop Name</th>
              <th className='p-4 text-nowrap'>Shop Address</th>
              <th className='p-4 '>Phone</th>
              <th className='p-4'>GSTIN</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>

          <tbody>
            {ApprovedMerchant.length === 0 ? (
              <tr>
              <td colSpan={5} className='p-6 text-center text-gray-400'>
                No Merchant Approval requests found
              </td>
              </tr>
            ) : (
             ApprovedMerchant.map((merchant, index) => (
              <tr key={index} className='border-t border-white/10 hover:bg-white/5'>
                <td className='p-4 text-xs'>{merchant?.name}</td>
                <td className='p-4 text-xs'>{merchant?.shopName || "-"}</td>
                <td className='p-4 text-xs'>{merchant?.shopAddress || "-"}</td>
                <td className='p-4 text-xs'>{merchant?.phone || "-"}</td>
                <td className='p-4 text-xs'>{merchant?.gstNumber}</td>
                <td className='p-4 text-center'>
                   <button className='w-full mt-3 bg-[#00684D] hover:bg-[#045f47]
                text-sm text-nowrap py-2 px-3 rounded-lg' onClick={() => setSelectedMerchant(merchant)}>Merchant Products</button>
                </td>
              </tr>
             ))
            )}
          </tbody>
        </table>
      </div>
      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
            {ApprovedMerchant.length === 0 ?(
              <div className='text-center text-gray-400 mt-10'>
                No Merchant Approval requests found
              </div>
            ) : (
             ApprovedMerchant.map((merchant, index) => (
               <div key={index} className='bg-white/10 border border-white/20 rounded-xl p-4 space-y-2'>
                <div className='flex justify-between items-center'>
                  <h3 className='font-semibold text-lg'>{merchant?.name}</h3>
                  <span className='px-3 py-1 rounded-full text-xs'>{merchant?.gstNumber}</span>
                </div>
                <p className='text-sm text-gray-300'>
                  <b>Shop:</b>{" "}{merchant.shopName}
                </p>
                <p className='text-sm text-gray-300'>
                  <b>Shop Address:</b>{" "}{merchant.shopAddress}
                </p>
                <p className='text-sm text-gray-300'>
                  <b>Phone:</b>{" "}{merchant.phone}
                </p>
                <button className='w-full mt-3 bg-[#00684D] hover:bg-[#045f47]
                text-sm py-2 rounded-lg' onClick={() => setSelectedMerchant(merchant)}>Merchant Products</button>
               </div>
             ))
            )}
      </div>
    <AnimatePresence>
  {selectedMerchant && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        exit={{ scale: 0.9 }}
        /* 👇 এখানে max-h-[85vh] এবং flex flex-col যোগ করা হয়েছে */
        className='bg-gray-900 p-6 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col border border-white/10'
      >
        <h3 className='text-xl sm:text-2xl w-full font-bold mb-4 shrink-0'>
          Products of {selectedMerchant.shopName}
        </h3>

        {selectedMerchant.merchantProducts?.length ? (
          /* 👇 এখানে flex-1 overflow-y-auto যোগ করা হয়েছে */
          <div className='flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar'>
            {selectedMerchant.merchantProducts.map((p: any, i: number) => (
              <div key={i} className='bg-white/10 p-4 rounded-lg border border-white/20'>
                {/* Top Section: Image & Basic Info */}
                <div className='flex gap-4'>
                  <Image 
                    src={p.image1} 
                    alt="img" 
                    width={70} 
                    height={70} 
                    className='rounded object-cover' 
                  />
                  <div>
                    <p className='font-semibold'>{p.title}</p>
                    <p className='text-sm text-gray-300'>৳{p.price}</p>
                  </div>
                </div>

                {/* Bottom Section: Details */}
                <div className='mt-3 text-sm space-y-1'>
                  <p><b>Category: </b>{p.category}</p>
                  <p><b>Description: </b>{p.description}</p>
                  <p>
                    <b>Verification: </b>{" "}
                    <span className={`px-2 py-1 rounded text-xs ${
                      p.verificationStatus === "approved"
                        ? "bg-[#00684D] text-[#06c491]"
                        : p.verificationStatus === "pending"
                        ? "bg-yellow-600/30 text-yellow-400"
                        : "bg-red-600/30 text-red-400"
                    }`}>
                      {p.verificationStatus}
                    </span>
                  </p>
                  <p>
                    <b>Active: </b>{" "}
                    <span className={`${p.isActive ? "text-[#00684D]" : "text-red-400"}`}>
                      {p.isActive ? "YES" : "NO"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-400 my-auto py-10'>No Product Found Yet</p>
        )}

        {/* Cancel Button (এটি নিচে ফিক্সড থাকবে, প্রডাক্ট লিস্ট স্ক্রল হবে) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMerchant(null)} 
          className='mt-4 shrink-0 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm w-full'
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  
    </div>
  )
}

export default MerchantDetails

