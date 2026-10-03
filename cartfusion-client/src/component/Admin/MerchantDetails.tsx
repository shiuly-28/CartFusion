/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import UseGetAllMerchant from '@/hooks/UseGetAllMerchant'
import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function MerchantDetails() {
  UseGetAllMerchant()

  const allMerchantData: IUser[] = useSelector((state: RootState) => state.merchant.AllMerchantData)

  const ApprovedMerchant = Array.isArray(allMerchantData)
    ? allMerchantData.filter((v) => v.verificationStatus === "approved")
    : []

  const [selectedMerchant, setSelectedMerchant] = useState<IUser | null>(null)

  return (
    <div className='w-full min-h-screen px-3 sm:px-6 lg:px-10 py-6 bg-gray-50 text-gray-900'>
      <h1 className='text-xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-gray-900'>
        Merchant Approval Details
      </h1>

      {/* desktop table */}
      <div className='hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm'>
        <table className='w-full text-left'>
          <thead className='bg-gray-100 text-gray-700'>
            <tr>
              <th className='p-4 text-nowrap'>Merchant Name</th>
              <th className='p-4 text-nowrap'>Shop Name</th>
              <th className='p-4 text-nowrap'>Shop Address</th>
              <th className='p-4'>Phone</th>
              <th className='p-4'>GSTIN</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>

          <tbody>
            {ApprovedMerchant.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-500'>
                  No approved merchants found
                </td>
              </tr>
            ) : (
              ApprovedMerchant.map((merchant, index) => (
                <tr key={index} className='border-t border-gray-200 hover:bg-gray-50'>
                  <td className='p-4 text-xs'>{merchant?.name}</td>
                  <td className='p-4 text-xs'>{merchant?.shopName || "-"}</td>
                  <td className='p-4 text-xs'>{merchant?.shopAddress || "-"}</td>
                  <td className='p-4 text-xs'>{merchant?.phone || "-"}</td>
                  <td className='p-4 text-xs'>{merchant?.gstNumber || "-"}</td>
                  <td className='p-4 text-center'>
                    <button
                      className='w-full bg-[#00684D] hover:bg-[#045f47] text-sm text-nowrap py-2 text-white px-3 rounded-lg'
                      onClick={() => setSelectedMerchant(merchant)}
                    >
                      Merchant Products
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
        {ApprovedMerchant.length === 0 ? (
          <div className='text-center text-gray-500 mt-10'>
            No approved merchants found
          </div>
        ) : (
          ApprovedMerchant.map((merchant, index) => (
            <div key={index} className='bg-white border border-gray-200 shadow-sm rounded-xl p-4 space-y-2'>
              <div className='flex justify-between items-center'>
                <h3 className='font-semibold text-lg'>{merchant?.name}</h3>
                <span className='px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700'>
                  {merchant?.gstNumber}
                </span>
              </div>
              <p className='text-sm text-gray-600'>
                <b>Shop:</b>{" "}{merchant.shopName}
              </p>
              <p className='text-sm text-gray-600'>
                <b>Shop Address:</b>{" "}{merchant.shopAddress}
              </p>
              <p className='text-sm text-gray-600'>
                <b>Phone:</b>{" "}{merchant.phone}
              </p>
              <button
                className='w-full mt-3 bg-[#00684D] hover:bg-[#045f47] text-white text-sm py-2 rounded-lg'
                onClick={() => setSelectedMerchant(merchant)}
              >
                Merchant Products
              </button>
            </div>
          ))
        )}
      </div>

      {/* products modal */}
      <AnimatePresence>
        {selectedMerchant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ scale: 0.9 }}
              className='bg-white text-gray-900 p-6 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col border border-gray-200 shadow-xl'
            >
              <h3 className='text-xl sm:text-2xl w-full font-bold mb-4 shrink-0'>
                Products of {selectedMerchant.shopName}
              </h3>

              {selectedMerchant.merchantProducts?.length ? (
                <div className='flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar'>
                  {selectedMerchant.merchantProducts.map((p: any, i: number) => (
                    <div key={i} className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                      {/* Top Section: Image & Basic Info */}
                      <div className='flex gap-4'>
                        <Image
                          src={p.image1}
                          alt={p.title || "Product image"}
                          width={70}
                          height={70}
                          className='rounded object-cover'
                        />
                        <div>
                          <p className='font-semibold'>{p.title}</p>
                          <p className='text-sm text-gray-600'>৳{p.price}</p>
                        </div>
                      </div>

                      {/* Bottom Section: Details */}
                      <div className='mt-3 text-sm space-y-1 text-gray-700'>
                        <p><b>Category: </b>{p.category}</p>
                        <p><b>Description: </b>{p.description}</p>
                        <p>
                          <b>Verification: </b>{" "}
                          <span className={`px-2 py-1 rounded text-xs ${
                            p.verificationStatus === "approved"
                              ? "bg-green-100 text-green-800"
                              : p.verificationStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {p.verificationStatus}
                          </span>
                        </p>
                        <p>
                          <b>Active: </b>{" "}
                          <span className={p.isActive ? "text-[#00684D] font-medium" : "text-red-600 font-medium"}>
                            {p.isActive ? "YES" : "NO"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-center text-gray-500 my-auto py-10'>No Product Found Yet</p>
              )}

              {/* Cancel button stays fixed at the bottom while the product list scrolls */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMerchant(null)}
                className='mt-4 shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm w-full'
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