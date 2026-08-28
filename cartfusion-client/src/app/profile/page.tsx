"use client"

import { RootState } from '@/redux/store'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion} from 'motion/react'
import Image from 'next/image'
import { AiOutlineUser } from 'react-icons/ai'
import { useRouter } from 'next/navigation'

function Profile() {
  const user = useSelector((state:RootState)=>state.user.userData)
  const router = useRouter()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditShop, setShowEditShop] = useState(false)
  return (
    <div className='min-h-screen  bg-linear-to-br from-gray-900 
    via-black to-gray-900 text-white px-6 pt-24 pb-10'>
      <motion.div
      initial={{scale: 0.95, opacity: 0}}
      animate={{scale: 1, opacity: 1 }}
      transition={{duration: 0.4}}
      className='max-w-3xl mx-auto bg-white/10 backdrop-blur-m p-6 sm:p-10 rounded-2xl border 
      border-white/20 shadow-xl'>
        <div className='flex flex-col items-center text-center'>
          <motion.div
          whileHover={{scale:1.05}}

           className='w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-white/30
          hover:border-[#00684D]'>
            {user?.image ?(
              <Image src={user?.image}
              alt="profile"
              width={120}
              height={120}
              className='w-full h-full object-cover'/>
            ):(
              <div className='w-full h-full flex items-center justify-center bg-gray-700'>
                  <AiOutlineUser size={48} className='text-white'/>
            </div>)}
          </motion.div>
          <h2 className='text-2xl sm:text-3xl font-bold mt-4'>{user?.name}</h2>
          <p className='text-gray-400 text-sm sm:text-base'>{user?.email}</p>
          <p className='text-gray-400 text-xs sm:text-sm mt-1'>Role: {" "} <span
          className='text-[#00684D] uppercase font-semibold'>{user?.role}</span></p>
        </div>

        <div className='mt-5 sapce-y-3 text-sm sm:text-base'>
          <p><b>Phone : </b>{user?.phone || "-"}</p>

          {user?.role == "merchant" && (
            <>
             <p><b>Shop Name : </b>{user?.shopName || "-"}</p>
             <p><b>Shop Address : </b>{user?.shopAddress || "-"}</p>
             <p><b>GSTIN : </b>{user?.gstNumber || "-"}</p>
            </>
          )}
        </div>
        <div className='flex flex-col gap-3 w-full mt-4'>
          {user?.role == "user" && (
            <motion.button
            onClick={()=>router.push("/orders")}
            whileHover={{scale:1.02}}
            className='bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold'>
              My Orders
            </motion.button>
          )}
           <motion.button
           onClick={()=> {setShowEditProfile(!showEditProfile); setShowEditShop(false)}}
            whileHover={{scale:1.02}}
            className='bg-[#00684D] hover:[#045f47] py-3 rounded-lg font-semibold'>
            Edit Profile
            </motion.button>

              {user?.role == "merchant" && (
              <motion.button
                onClick={()=> {setShowEditShop(!showEditShop); setShowEditProfile(false)}}
              whileHover={{scale:1.02}}
              className='bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold'>
              Edit Shop Details
            </motion.button>
          )}
        </div>
      </motion.div>
      <AnimatePresence>
        
      </AnimatePresence>
    </div>
  )
}

export default Profile