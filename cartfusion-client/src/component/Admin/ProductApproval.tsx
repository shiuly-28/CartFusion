"use client"

import UseGetAllProducts from '@/hooks/UseGetAllProductsData'
import { IProduct } from '@/model/product.model'
import { setAllProductData } from '@/redux/merchantSlice'

import { AppDispatch, RootState } from '@/redux/store'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import { div, tr } from 'motion/react-client'
import Image from 'next/image'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

function ProductApproval() {
  const dispatch = useDispatch<AppDispatch>()
  UseGetAllProducts()

  const allProductData: IProduct[] = useSelector((state:RootState)=>state.merchant.allProductData)
  const pendingProsucts = Array.isArray(allProductData)?
    allProductData.filter((p)=>p.verificationStatus === "pending") : []

    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
    const [loading, setLoading] = useState(false)
    const [rejectModal, setRejectModal] = useState(false)
    const [rejectedReason, setRejectedReason] = useState("")

    const openRejectReasonArea = () => {
      setRejectModal(true)
      setRejectedReason("")
    }

    const handleApproved = async () => {
      if(!selectedProduct)return;
      setLoading(true)
      try{
       await axios.post("/api/admin/update-product-status", {
          productId: selectedProduct._id,
          status: "approved"
        })
        const updated = allProductData.filter((v) => v._id !== selectedProduct._id)

        dispatch(setAllProductData(updated))
        setSelectedProduct(null)
        setLoading(false)
        alert("Product Approved")
      }catch (error){
        console.log(error)
        setLoading(false)
        alert("Approval failed")
      }
    }
    const handleRejected = async () => {
      if(!selectedProduct)return;
      setLoading(true)
      try{
       await axios.post("/api/admin/update-product-status", {
          productId: selectedProduct._id,
          status: "rejected",
          rejectedReason
        })
        const updated = allProductData.filter((v) => v._id !==selectedProduct._id)

        dispatch(setAllProductData(updated))
        setSelectedProduct(null)
        setLoading(false)
        setRejectModal(false)
        alert("Product Rejected")
      }catch (error){
        console.log(error)
        setLoading(false)
        alert("Rejected failed")
      }
    }
  return (
      <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
        <h1 className='tex-xl sm:text-xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-white'>Product Approval Request</h1>
      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
            <tr>
              <th className='p-4'>Image</th>
              <th className='p-4'>Title</th>
              <th className='p-4'>Price</th>
              <th className='p-4'>Category</th>
              <th className='p-4'>status</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingProsucts.length === 0 ? (
              <tr>
              <td colSpan={5} className='p-6 text-center text-gray-400'>
                No Product Approval requests found
              </td>
              </tr>
            ) : (
             pendingProsucts.map((Product, index) => (
              <tr key={index} className='border-t border-white/10 hover:bg-white/5'>
                <td className='p-4'>
                  <Image src={Product.image1} alt='img1' width={50} height={50}
                  className='rounded object-cover'
                  />
                </td>
                <td className='p-4'>{Product.title}</td>
                <td className='p-4'>{Product.price}</td>
                <td className='p-4'>{Product.category}</td>

                <td className='p-4'><span className='px-3 py-1 rounded-full text-xs bg-yellow-500/50 text-yellow-300'>
                {Product.verificationStatus}</span></td>
                <td className='p-4 text-center'>
                  <motion.button
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.97}}
                  onClick={() =>setSelectedProduct(Product)}
                  className='px-4 py-1 rounded-md bg-[#00684D] hover:bg-[#045f47]'>Check Details</motion.button>
                </td>
              </tr>
             ))
            )}
          </tbody>
        </table>
      </div>
      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
            {pendingProsucts.length === 0 ?(
              <div className='text-center text-gray-400 mt-10'>
                No Product Approval requests found
              </div>
            ) : (
             pendingProsucts.map((product, index) => (
               <div key={index} className='bg-white/10 border border-white/20 rounded-xl p-4 space-y-2'>
                <div className='flex items-center'>
                  <Image src={product.image1} alt='img' width={50} height={50}/>
                </div>
                <div className=''>
                  <h3 className='font-semibold'>{product.title}</h3>
                  <p className='text-sm text-gray-400'>{product.price}</p>
                </div>
                <div className='space-y-2 justify-between items-center'>
                  <p className='text-sm text-gray-400'>{product.category}</p>
                  <span className='px-3 py-1 rounded-full text-xs bg-yellow-500/50 text-yellow-300'>
                {product.verificationStatus}</span>
                </div>
                 <button
                  onClick={() =>setSelectedProduct(product)}
                  className='px-4 py-1 rounded-md bg-[#00684D] hover:bg-[#045f47]'>Check Details</button>
               </div>
             ))
            )}
      </div>
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
          initial = {{opacity: 0}}
          animate = {{ opacity : 1 }}
          transition={{duration : 0.3}}
          exit={{opacity: 0}}
          className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'>
            <motion.div 
              initial = {{scale: 0.9 }}
            animate = {{ scale : 1 }}
            transition={{duration : 0.3}}
            exit={{scale: 0.9}}
            className='bg-gray-900 p-6 rounded-2xl w-full max-w-lg 
            border border-white/10'>
              <h3 className='text-xl sm:text-2xl w-full font-bold mb-4'>Selected Product Details</h3>
              <Image src={selectedProduct?.image1} alt="img"
              width={50} height={50}/>

              <div className='space-y-2 text-sm'>
             <p><b>Title:</b> {selectedProduct.title}</p>
             <p><b>Price:</b> {selectedProduct.price}</p>
             <p><b>Category:</b> {selectedProduct.category}</p>
             <p><b>Description:</b> {selectedProduct.description}</p>
             <p>
              <b>status</b>{" "}
                <span className='text-yellow-400'>Pending</span></p>
              </div>

              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <button disabled={loading} className='flex-1 bg-[#00684D] hover:bg-[#045f47] py-2 rounded-lg text-sm'
                 onClick={handleApproved}>{loading? <ClipLoader size={22} color='white'/>:"Approved"}</button>

                <button className='flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm'
                onClick={openRejectReasonArea}
                >Rejected</button>
                <button onClick={() => setSelectedProduct(null)} className='flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm'>Cancel</button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectModal && (
          <motion.div
          initial = {{opacity: 0}}
          animate = {{ opacity : 1 }}
          transition={{duration : 0.3}}
          exit={{opacity: 0}}
          className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'>
            <motion.div 
              initial = {{scale: 0.9 }}
            animate = {{ scale : 1 }}
            transition={{duration : 0.3}}
            exit={{scale: 0.9}}
            className='bg-gray-900 p-6 rounded-2xl w-full max-w-lg 
            border border-white/10'>
              <h3 className='text-xl sm:text-2xl w-full font-bold mb-4'>Enter Rejected Reason</h3>
             
                <textarea placeholder='Enter rejection reason...'
                className='w-full bg-white/10 border border-white/20 rounded-lg p-3 *:
                text-sm' rows={3} onChange={(e)=>setRejectedReason(e.target.value)}
                value={rejectedReason}
                />

                <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                  <button disabled={loading} className='flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm'
               onClick={handleRejected}
                >{loading ? <ClipLoader size={20} color='white'/>: "Confirm Rejected"}</button>
                <button onClick={() => setRejectModal(false)} className='flex-1
                 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm'>Cancel</button>
            
                </div>
                
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductApproval;

