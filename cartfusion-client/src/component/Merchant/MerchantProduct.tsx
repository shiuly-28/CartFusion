"use client"
import React from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser'
import UseGetAllProducts from '@/hooks/UseGetAllProductsData'

function MerchantProduct() {
  const router = useRouter()
  UserGetCurrentUser()
  UseGetAllProducts()

  const currentUser = useSelector((state: RootState) => state.user.userData)
  const { allProductData } = useSelector((state: RootState) => state.merchant)

  const myProducts =
    currentUser?._id && allProductData?.length
      ? allProductData.filter(
          (p: any) =>
            p.merchant === currentUser?._id ||
            p.merchant?._id === currentUser?._id
        )
      : []

  return (
    <div className='w-full p-4 sm:p-8 text-white'>
      {/* header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold'>My Products</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("/addMerchantProduct")}
          className='bg-[#00684D] hover:bg-[#045f47] px-5 py-2 rounded-lg font-semibold text-sm sm:text-base'
        >
          + Add Product
        </motion.button>
      </div>

      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-white/10'>
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
                {/* Fixed colSpan to 6 to align all columns */}
                <td colSpan={6} className='p-6 text-center text-gray-400'>
                  No Merchant Product found
                </td>
              </tr>
            ) : (
              myProducts.map((p, index) => (
                <tr key={index} className='border-t border-white/10 hover:bg-white/5'>
                  <td className='p-4'>
                    <Image
                      src={p?.image1}
                      alt='img1'
                      width={50}
                      height={50}
                      className='rounded object-cover'
                    />
                  </td>
                  <td className='p-4'>{p?.title}</td>
                  <td className='p-4'>৳ {p?.price}</td>
                  <td className='p-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs bg-gray-400/20 ${
                        p.verificationStatus === "approved"
                          ? "text-[#00684D]"
                          : p.verificationStatus === "pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {p?.verificationStatus}
                    </span>
                  </td>
                  <td className='p-4'>
                    <span
                      className={`text-sm ${
                        p.isActive ? "text-[#00684D]" : "text-red-500"
                      }`}
                    >
                      {p?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Fixed flex container layout for Action Cell */}
                  <td className='p-4 align-middle'>
                    <div className='flex items-center justify-center gap-2 flex-wrap'>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={()=>router.push(`/updateProduct/${p._id}`)}
                        className='px-3 py-1 rounded text-sm bg-amber-500 hover:bg-amber-600 font-medium'
                      >
                        Edit
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={p.verificationStatus !== "approved"}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          p.verificationStatus === "approved"
                            ? "bg-[#00684D] hover:bg-[#045f47]"
                            : "bg-gray-600 cursor-not-allowed opacity-70"
                        }`}
                      >
                        {p.isActive ? "Disable" : "Enable"}
                      </motion.button>
                    </div>

                   {p.verificationStatus === "rejected" && (
  <div className='mt-2 bg-red-400/10 border border-red-400/30 text-red-300 text-xs p-2 rounded text-center'>
    <p>
      <b>Rejected: </b>
      {p.rejectedReason || "No reason provided"}
    </p>
    <p className='mt-1 text-yellow-300'>
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
          <div className='text-center text-gray-400 mt-10'>
            No Merchant Product found
          </div>
        ) : (
          myProducts.map((p, index) => (
            <div
              key={index}
              className='bg-white/10 border border-white/20 rounded-xl p-4 space-y-2'
            >
              <div className='flex items-center gap-3'>
                <Image
                  src={p.image1}
                  alt="product"
                  width={60}
                  height={60}
                  className='rounded object-cover'
                />
                <div>
                  <h2 className='font-semibold'>{p.title}</h2>
                  <p className='text-sm text-gray-300'>৳ {p.price}</p>
                </div>
              </div>

              <div className='mt-3 text-sm space-y-1'>
                <p>
                  <b>Status: </b>
                  <span
                    className={`${
                      p.verificationStatus === "approved"
                        ? "text-[#00684D]"
                        : p.verificationStatus === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {p.verificationStatus}
                  </span>
                </p>
                <p>
                  <b>Active: </b>
                  <span
                    className={
                      p.isActive ? "text-[#00684D]" : "text-red-500"
                    }
                  >
                    {p.isActive ? "Yes" : "No"}
                  </span>
                </p>
              </div>

            {p.verificationStatus === "rejected" && (
              <div className='mt-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-2 rounded text-center'>
             <p>
            <b>Rejected: </b>
            {p.rejectedReason || "No reason provided"}
            </p>
              <p className='mt-1 text-yellow-300'>
               After edit, product will be sent for re-verification.
              </p>
              </div>
              )}

              <div className='flex items-center gap-3 mt-4'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                   onClick={()=>router.push(`/updateProduct/${p._id}`)}
                  className='px-4 py-1.5 rounded text-sm bg-amber-500 hover:bg-amber-600 font-medium'
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={p.verificationStatus !== "approved"}
                  className={`px-4 py-1.5 rounded text-sm font-medium ${
                    p.verificationStatus === "approved"
                      ? "bg-[#00684D] hover:bg-[#045f47]"
                      : "bg-gray-600 cursor-not-allowed opacity-70"
                  }`}
                >
                  {p.isActive ? "Disable" : "Enable"}
                </motion.button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MerchantProduct