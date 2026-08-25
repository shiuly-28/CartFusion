"use client"

import UseGetAllMerchant from '@/hooks/UseGetAllMerchant'
import { IUser } from '@/model/user.model'
import { setAllMerchantData } from '@/redux/merchantSlice'
import { AppDispatch, RootState } from '@/redux/store'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import { div, tr } from 'motion/react-client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

function MerchantApproval() {
  const dispatch = useDispatch<AppDispatch>()
  UseGetAllMerchant()

  const allMerchantData: IUser[] = useSelector((state:RootState)=>state.merchant.AllMerchantData)
  const pendingMerchant = Array.isArray(allMerchantData)?
    allMerchantData.filter((v)=>v.verificationStatus === "pending") : []

    const [selectedMerchant, setSelectedMerchant] = useState<IUser | null>(null)
    const [loading, setLoading] = useState(false)
    const [rejectModal, setRejectModal] = useState(false)
    const [rejectedReason, setRejectedReason] = useState("")

    const openRejectReasonArea = () => {
      setRejectModal(true)
      setRejectedReason("")
    }

    const handleApproved = async () => {
      if(!selectedMerchant)return;
      setLoading(true)
      try{
       await axios.post("/api/admin/update-merchant-status", {
          merchantId: selectedMerchant._id,
          status: "approved"
        })
        const updated = allMerchantData.filter((v) => v._id !==selectedMerchant._id)

        dispatch(setAllMerchantData(updated))
        setSelectedMerchant(null)
        setLoading(false)
        alert("Merchant Approved")
      }catch (error){
        console.log(error)
        setLoading(false)
        alert("Approvel failed")
      }
    }
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
              <h3 className='text-xl sm:text-2xl w-full font-bold mb-4'>Selected Merchant Details</h3>
              <div className='space-y-2 text-sm'>
                <p><b>Name:</b>{" "}{selectedMerchant.name}</p>
                <p><b>Email:</b>{" "}{selectedMerchant.email}</p>
                <p><b>Phone:</b>{" "}{selectedMerchant.phone}</p>
                <p><b>ShopName:</b>{" "}{selectedMerchant.shopName}</p>
                <p><b>ShopAddress:</b>{" "}{selectedMerchant.shopAddress}</p>
                <p><b>GSTIN:</b>{" "}{selectedMerchant.gstNumber}</p>
              </div>
              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <button disabled={loading} className='flex-1 bg-[#00684D] hover:bg-[#045f47] py-2 rounded-lg text-sm'
                 onClick={handleApproved}>{loading? <ClipLoader size={22} color='white'/>:"Approved"}</button>

                <button className='flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm'
                onClick={openRejectReasonArea}
                >Rejected</button>
                <button onClick={() => setSelectedMerchant(null)} className='flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm'>Cancel</button>
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
              <h3 className='text-xl sm:text-2xl w-full font-bold mb-4'>Enter Rjecyed Reason</h3>
             
                <textarea placeholder='Enter rejection reason...'
                className='w-full bg-white/10 border border-white/20 rounded-lg p-3 *:
                text-sm' rows={3} onChange={(e)=>setRejectedReason(e.target.value)}
                value={rejectedReason}
                />
                <button className='flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm'
               
                >Confirm Rejected</button>
                <button onClick={() => setRejectModal(false)} className='flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm'>Cancel</button>
            
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MerchantApproval
