"use client"
import React, { useEffect, useState } from 'react'
import {  AnimatePresence, motion } from "motion/react"
import { AiOutlineShop, AiOutlineTool, AiOutlineUser } from 'react-icons/ai'
import axios from 'axios'
function EditRoleAndPhone() {
  const [role, setRole] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const roles = [
    {label: "Admin", value: "admin", icon: <AiOutlineTool size={40} />},
    {label: "merchant", value: "merchant", icon: <AiOutlineShop size={40} />},
    {label: "user", value: "user", icon: <AiOutlineUser size={40} />}
  ]
  const [adminExist, setAdminExist] = useState(false)

  useEffect(() =>{
    const checkAdmin = async () =>{
      try{
        const res = await axios.get("/api/admin/check-admin")
      }catch(error){
        setAdminExist(false)
        console.log(error)
      }
    }
    checkAdmin()
  }, [])
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900
    text-white p-6'>
      <AnimatePresence>
        <motion.div
        initial={{ opacity: 0, y:-40 }}
      animate={{ opacity: 1, y:0 }}
      exit={{ opacity: 0, y:-40 }}
      transition={{duration:0.5}}
      className='w-full max-w-lg bg-white/10
       backdrop-blur-md rounded-3xl shadow-xl p-10 border border-white/10'>
            <h1 className='text-4xl font-semibold text-center mb-4'>Choose Your Role</h1>
            <p className='text-center text-gray-300 mb-8 text-base'>Select Your Role </p>
            <form action="" className='flex flex-col gap-8'>
              <input type="text"
              placeholder='Enter Your Mobile Number'
              maxLength={10}
              required
              className='bg-white/10 border border-white/10 rounded-lg p-4 text-lg focus:outline-none
              focus:ring-2 focus:ring-[#00684D]' 
              onSubmit={(e) =>setPhone(e.target.value)} value={phone}/>

              <div className=''>

              </div>
            </form>
      </motion.div>
      </AnimatePresence>
      
    </div>
  )
}

export default EditRoleAndPhone
