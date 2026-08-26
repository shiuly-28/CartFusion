"use client"
import { IUser } from '@/model/user.model'
import { div } from 'motion/react-client'
import React, { useState } from 'react'
import MerchantDashBoard from './MerchantDashBoard'

function MerchantPage({ user }: { user: IUser }) {
  const [openVeryfyform, setOpenVeryfyform] = useState(false)
  const [shopName, setShopName] = useState(user?.shopName || "")
  const [shopAddress, setAddressName] = useState(user?.shopAddress || "")
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || "")
  const [loading, setLoading] = useState(false)

  const handleVerifyAgain = async () => {
    if(!shopAddress || !shopName || !gstNumber){
      alert("Fill all fields")
      return;
    }
    setLoading(true)
  }

  if(!user){
    return(
     <div className='w-full min-h-screen flex items-center justify-center text-white bg-linear-to-br
      from-gray-900 via-black to-gray-900'>
        Loading.....
      
    </div>
    )
  }
  if(user.verificationStatus == "approved"){
    return(
      <div className='w-full min-h-screen pt-16'>
        <MerchantDashBoard/>
      </div>
    )
  }

  if(user.verificationStatus == "pending"){
    return(
      <div className='w-full min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 
      via-black to-gray-900 text-white px-4'>
        <div className='bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30
        max-w-2xl w-full text-center'>
          <h2 className='text-4xl font-bold mb-6 text-[#00684D]'>Verification Pending 🩸</h2>
          <p className='text-gray-200 text-lg leading-relaxed'>
            You can access merchant dashboard only after <span className='font-semibold'>
              Admin Varication</span></p>
              <div className='mt-6 text-base text-gray-300'>
                VerificationStatus : {" "} <span
                className='text-[#00684D] font-semibold uppercase'>{user.verificationStatus}</span>
              </div>
              <div className='mt-10 text-sm text-gray-400'>It Usually takes 2-3 hours.</div>
        </div>
      </div>
    )
  }
   if(user.verificationStatus == "rejected"){
    return(
    <div className='w-full min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 
      via-black to-gray-900 text-white px-4'>
        <div className='bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30
        max-w-2xl w-full text-center'>
          <h2 className='text-4xl font-bold mb-6 text-red-400'>Verification Rejected ⚔️</h2>
          <p className='text-gray-200 text-lg leading-relaxed'>
            Your business Verification was rejected by  <span className='font-semibold'>
              Admin </span></p>
              <div className='mt-6 mb-2 text-base text-gray-300'>
                VerificationStatus : {" "} <span
                className='text-red-500 font-semibold uppercase'>{user.verificationStatus}</span>
              </div>
              <div className='mb-6 text-sm text-red-400'>Reason : {user.rejectedReason}</div>
        

        {!openVeryfyform ? (
          <button
          onClick={()=>setOpenVeryfyform(true)}
          className='bg-[#00684D] hover:bg-[#045f47] px-8 py-3 rounded-lg font-semibold'>
            Verify Again
          </button>
        ): (
          <div className='mt-6 text-left space-y-4'>
            <input type="text"
            placeholder='Shop Name'
            className='w-full p-3 rounded bg-white/10 border border-white/20'
            onChange={(e)=>setShopName(e.target.value)} value={shopName} />

            <input type="text"
            placeholder='Shop Address'
            className='w-full p-3 rounded bg-white/10 border border-white/20'
            onChange={(e)=>setAddressName(e.target.value)} value={shopAddress} />

            <input type="text"
            placeholder='GSTIN Number'
            className='w-full p-3 rounded bg-white/10 border border-white/20'
            onChange={(e)=>setGstNumber(e.target.value)} value={gstNumber} />
            <button className='w-full p-2 bg-[#00684D] hover:bg-[#045f47] rounded-lg font-semibold'>Submit & Verify again</button>
            <button onClick={()=>setOpenVeryfyform(false)}
             className='w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold'>Cancel</button>
          </div>
        )}
      </div>
    </div>
    )
   }
}

export default MerchantPage

