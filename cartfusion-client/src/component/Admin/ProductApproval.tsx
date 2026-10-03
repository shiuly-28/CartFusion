"use client"

import UseGetAllProducts from '@/hooks/UseGetAllProductsData'
import { IProduct } from '@/model/product.model'
import { setAllProductData } from '@/redux/merchantSlice'

import { AppDispatch, RootState } from '@/redux/store'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

function ProductApproval() {
  const dispatch = useDispatch<AppDispatch>()
  UseGetAllProducts()

  const allProductData: IProduct[] = useSelector((state: RootState) => state.merchant.allProductData)
  const pendingProducts = Array.isArray(allProductData)
    ? allProductData.filter((p) => p.verificationStatus === "pending")
    : []

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectedReason, setRejectedReason] = useState("")

  const openRejectReasonArea = () => {
    setRejectModal(true)
    setRejectedReason("")
  }

  const handleApproved = async () => {
    if (!selectedProduct) return
    setLoading(true)
    try {
      await axios.post("/api/admin/update-product-status", {
        productId: selectedProduct._id,
        status: "approved"
      })
      const updated = allProductData.filter((v) => v._id !== selectedProduct._id)
      dispatch(setAllProductData(updated))
      setSelectedProduct(null)
      setLoading(false)
      alert("Product Approved")
    } catch (error) {
      console.log(error)
      setLoading(false)
      alert("Approval failed")
    }
  }

  const handleRejected = async () => {
    if (!selectedProduct) return
    setLoading(true)
    try {
      await axios.post("/api/admin/update-product-status", {
        productId: selectedProduct._id,
        status: "rejected",
        rejectedReason
      })
      const updated = allProductData.filter((v) => v._id !== selectedProduct._id)
      dispatch(setAllProductData(updated))
      setSelectedProduct(null)
      setLoading(false)
      setRejectModal(false)
      alert("Product Rejected")
    } catch (error) {
      console.log(error)
      setLoading(false)
      alert("Rejection failed")
    }
  }

  return (
    <div className='w-full min-h-screen bg-gray-50 text-gray-900 px-3 sm:px-6 lg:px-10 py-6'>
      <h1 className='text-xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-gray-900'>
        Product Approval Request
      </h1>

      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white rounded-xl border border-gray-200 shadow-sm'>
        <table className='w-full text-left'>
          <thead className='bg-gray-100 text-gray-700'>
            <tr>
              <th className='p-4'>Image</th>
              <th className='p-4'>Title</th>
              <th className='p-4'>Price</th>
              <th className='p-4'>Category</th>
              <th className='p-4'>Status</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-500'>
                  No Product Approval requests found
                </td>
              </tr>
            ) : (
              pendingProducts.map((product, index) => (
                <tr key={index} className='border-t border-gray-200 hover:bg-gray-50'>
                  <td className='p-4'>
                    <Image
                      src={product.image1}
                      alt={product.title || 'Product image'}
                      width={50}
                      height={50}
                      className='rounded object-cover'
                    />
                  </td>
                  <td className='p-4'>{product.title}</td>
                  <td className='p-4'>{product.price}</td>
                  <td className='p-4'>{product.category}</td>
                  <td className='p-4'>
                    <span className='px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800'>
                      {product.verificationStatus}
                    </span>
                  </td>
                  <td className='p-4 text-center'>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedProduct(product)}
                      className='px-4 py-1 rounded-md bg-[#00684D] hover:bg-[#045f47] text-white'
                    >
                      Check Details
                    </motion.button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
        {pendingProducts.length === 0 ? (
          <div className='text-center text-gray-500 mt-10'>
            No Product Approval requests found
          </div>
        ) : (
          pendingProducts.map((product, index) => (
            <div key={index} className='bg-white border border-gray-200 shadow-sm rounded-xl p-4 space-y-2'>
              <div className='flex items-center'>
                <Image
                  src={product.image1}
                  alt={product.title || 'Product image'}
                  width={50}
                  height={50}
                  className='rounded object-cover'
                />
              </div>
              <div>
                <h3 className='font-semibold'>{product.title}</h3>
                <p className='text-sm text-gray-600'>{product.price}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-600'>{product.category}</p>
                <span className='inline-block px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800'>
                  {product.verificationStatus}
                </span>
              </div>
              <button
                onClick={() => setSelectedProduct(product)}
                className='w-full mt-2 py-2 rounded-lg text-sm bg-[#00684D] hover:bg-[#045f47] text-white'
              >
                Check Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* details modal */}
      <AnimatePresence>
        {selectedProduct && (
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
              className='bg-white text-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-200 shadow-xl'
            >
              <h3 className='text-xl sm:text-2xl w-full font-bold mb-4'>Selected Product Details</h3>
              <Image
                src={selectedProduct.image1}
                alt={selectedProduct.title || 'Product image'}
                width={50}
                height={50}
                className='rounded object-cover mb-3'
              />

              <div className='space-y-2 text-sm text-gray-700'>
                <p><b>Title:</b> {selectedProduct.title}</p>
                <p><b>Price:</b> {selectedProduct.price}</p>
                <p><b>Category:</b> {selectedProduct.category}</p>
                <p><b>Description:</b> {selectedProduct.description}</p>
                <p>
                  <b>Status:</b>{" "}
                  <span className='text-yellow-700 font-medium'>Pending</span>
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <button
                  disabled={loading}
                  className='flex-1 bg-[#00684D] hover:bg-[#045f47] text-white py-2 rounded-lg text-sm'
                  onClick={handleApproved}
                >
                  {loading ? <ClipLoader size={22} color='white' /> : "Approve"}
                </button>
                <button
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm'
                  onClick={openRejectReasonArea}
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm'
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* reject reason modal */}
      <AnimatePresence>
        {rejectModal && (
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
              className='bg-white text-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-200 shadow-xl'
            >
              <h3 className='text-xl sm:text-2xl w-full font-bold mb-4'>Enter Rejection Reason</h3>

              <textarea
                placeholder='Enter rejection reason...'
                className='w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00684D]'
                rows={3}
                onChange={(e) => setRejectedReason(e.target.value)}
                value={rejectedReason}
              />

              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <button
                  disabled={loading}
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm'
                  onClick={handleRejected}
                >
                  {loading ? <ClipLoader size={20} color='white' /> : "Confirm Reject"}
                </button>
                <button
                  onClick={() => setRejectModal(false)}
                  className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm'
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductApproval