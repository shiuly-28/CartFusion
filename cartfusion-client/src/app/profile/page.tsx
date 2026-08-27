"use client"

import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion} from 'motion/react'
import Image from 'next/image'
import { AiOutlineUser } from 'react-icons/ai'

function Profile() {
  const user = useSelector((state:RootState)=>state.user.userData)
  console.log(user)
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
          <p className='text-gray-400 text-xs sm:text-sm mt-1'>Role: {user?.role}</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile