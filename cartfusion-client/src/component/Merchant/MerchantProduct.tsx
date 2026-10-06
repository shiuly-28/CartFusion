/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import Image from 'next/image'
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser'
import UseGetAllProducts from '@/hooks/UseGetAllProductsData'
import axios from 'axios'
import { setAllProductData } from '@/redux/merchantSlice'

const statusBadge = (status: string) =>
  status === "approved"
    ? "bg-green-100 text-green-800"
    : status === "pending"
    ? "bg-yellow-100 text-yellow-800"
    : "bg-red-100 text-red-700"

function MerchantProduct() {
  const router = useRouter()
  UserGetCurrentUser()
  UseGetAllProducts()
  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector((state: RootState) => state.user.userData)
  const { allProductData } = useSelector((state: RootState) => state.merchant)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const myProducts =
    currentUser?._id && allProductData?.length
      ? allProductData.filter(
          (p: any) =>
            p.merchant === currentUser?._id ||
            p.merchant?._id === currentUser?._id) : []

  const totalPages = Math.ceil(myProducts.length / itemsPerPage)
  // keep the page valid after a product is deleted
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const paginatedProducts = myProducts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  )

  const toggleIsActive = async (productId: string, currentisActive: boolean) => {
    try {
      const result = await axios.post("/api/merchant/isActiveProduct",
        { productId, isActive: !currentisActive })
      const updatedProducts = allProductData.map((p: any) => p._id === productId ? result.data : p)
      dispatch(setAllProductData(updatedProducts))
    } catch (error) {
      console.log(error)
      alert("Update isActive error")
    }
  }

  const deleteProduct = async (productId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product? This action cannot be undone.")
    if (!confirmDelete) return

    try {
      await axios.post("/api/merchant/deleteProduct", { productId })
      const updatedProducts = allProductData.filter((p: any) => p._id !== productId)
      dispatch(setAllProductData(updatedProducts))
      alert("✅ Product deleted successfully")
    } catch (error) {
      console.log(error)
      alert("❌ Delete product error")
    }
  }

  return (
    <div className='w-full min-h-screen px-3 sm:px-6 lg:px-10 py-6 bg-gray-50 text-gray-900'>
      {/* header */}
      <div className='flex justify-between items-center gap-2 mb-6'>
  <h1 className='text-xl sm:text-3xl font-bold whitespace-nowrap'>My Products</h1>
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => router.push("/addMerchantProduct")}
    className='bg-[#00684D] hover:bg-[#045f47] px-3 sm:px-5 py-2 rounded-lg font-semibold text-xs sm:text-base text-white whitespace-nowrap shrink-0'
  >
    + Add Product
  </motion.button>
</div>

      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white rounded-xl border border-gray-200 shadow-sm'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-gray-100 text-gray-700'>
            <tr>
              <th className='p-4'>Image</th>
              <th className='p-4'>Title</th>
              <th className='p-4'>Price</th>
              <th className='p-4'>Status</th>
              <th className='p-4'>Active</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>

          <tbody>
            {myProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-500'>
                  No Merchant Product found
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p, index) => (
                <tr key={index} className='border-t border-gray-200 hover:bg-gray-50'>
                  <td className='p-4'>
                    <Image
                      src={p?.image1}
                      alt={p?.title || 'Product image'}
                      width={50}
                      height={50}
                      className='rounded object-cover'
                    />
                  </td>
                  <td className='p-4'>{p?.title}</td>
                  <td className='p-4'>৳ {p?.price}</td>
                  <td className='p-4'>
                    <span className={`px-3 py-1 rounded-full text-xs ${statusBadge(p.verificationStatus)}`}>
                      {p?.verificationStatus}
                    </span>
                  </td>
                  <td className='p-4'>
                    <span className={`text-sm font-medium ${p.isActive ? "text-[#00684D]" : "text-red-600"}`}>
                      {p?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className='p-4 align-middle'>
                    <div className='flex items-center justify-center gap-2 flex-wrap'>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push(`/updateProduct/${p._id}`)}
                        className='px-3 py-1 rounded text-sm bg-amber-500 hover:bg-amber-600 font-medium text-white'
                      >
                        Edit
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={p.verificationStatus !== "approved"}
                        onClick={() => toggleIsActive(String(p._id), Boolean(p.isActive))}
                        className={`px-3 py-1 rounded text-sm font-medium text-white ${
                          p.verificationStatus === "approved"
                            ? "bg-[#00684D] hover:bg-[#045f47]"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {p.isActive ? "Disable" : "Enable"}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => deleteProduct(String(p._id))}
                        className='px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700 font-medium text-white'
                      >
                        Remove
                      </motion.button>
                    </div>

                    {p.verificationStatus === "rejected" && (
                      <div className='mt-2 bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded text-center'>
                        <p>
                          <b>Rejected: </b>
                          {p.rejectedReason || "No reason provided"}
                        </p>
                        <p className='mt-1 text-orange-600'>
                          After edit, product will be sent for re-verification.
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
        {myProducts.length === 0 ? (
          <div className='text-center text-gray-500 mt-10'>
            No Merchant Product found
          </div>
        ) : (
          paginatedProducts.map((p, index) => (
            <div
              key={index}
              className='bg-white border border-gray-200 shadow-sm rounded-xl p-4 space-y-2'
            >
              <div className='flex items-center gap-3'>
                <Image
                  src={p.image1}
                  alt={p.title || "product"}
                  width={60}
                  height={60}
                  className='rounded object-cover'
                />
                <div>
                  <h2 className='font-semibold'>{p.title}</h2>
                  <p className='text-sm text-gray-600'>৳ {p.price}</p>
                </div>
              </div>

              <div className='mt-3 text-sm space-y-1'>
                <p>
                  <b>Status: </b>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(p.verificationStatus)}`}>
                    {p.verificationStatus}
                  </span>
                </p>
                <p>
                  <b>Active: </b>
                  <span className={`font-medium ${p.isActive ? "text-[#00684D]" : "text-red-600"}`}>
                    {p.isActive ? "Yes" : "No"}
                  </span>
                </p>
              </div>

              {p.verificationStatus === "rejected" && (
                <div className='mt-2 bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded text-center'>
                  <p>
                    <b>Rejected: </b>
                    {p.rejectedReason || "No reason provided"}
                  </p>
                  <p className='mt-1 text-orange-600'>
                    After edit, product will be sent for re-verification.
                  </p>
                </div>
              )}

              <div className='flex items-center gap-3 mt-4'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/updateProduct/${p._id}`)}
                  className='px-4 py-1.5 rounded text-sm bg-amber-500 hover:bg-amber-600 font-medium text-white'
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleIsActive(String(p._id), Boolean(p.isActive))}
                  disabled={p.verificationStatus !== "approved"}
                  className={`px-4 py-1.5 rounded text-sm font-medium text-white ${
                    p.verificationStatus === "approved"
                      ? "bg-[#00684D] hover:bg-[#045f47]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {p.isActive ? "Disable" : "Enable"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => deleteProduct(String(p._id))}
                  className='px-4 py-1.5 rounded text-sm bg-red-600 hover:bg-red-700 font-medium text-white'
                >
                  Remove
                </motion.button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {myProducts.length > 0 && totalPages > 1 && (
        <div className='flex items-center justify-center gap-2 mt-6 flex-wrap'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={safePage === 1}
            className='px-3 py-1.5 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-gray-800'
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded text-sm ${
                safePage === page
                  ? "bg-[#00684D] text-white font-semibold"
                  : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-800"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={safePage === totalPages}
            className='px-3 py-1.5 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-gray-800'
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default MerchantProduct