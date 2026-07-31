"use client"
import React, { useEffect, useState } from 'react'
import {  AnimatePresence, motion } from "motion/react"
import { AiOutlineShop, AiOutlineTool, AiOutlineUser } from 'react-icons/ai'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'
function EditRoleAndPhone() {
  const [role, setRole] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const roles = [
    {label: "Admin", value: "admin", icon: <AiOutlineTool size={40} />},
    {label: "merchant", value: "merchant", icon: <AiOutlineShop size={40} />},
    {label: "user", value: "user", icon: <AiOutlineUser size={40} />}
  ]
  const [adminExist, setAdminExist] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    if(!role || !phone){
      alert("please select the role and enter the phone number")
      return;
    }
    setLoading(true)
    try{
      const result = await axios.post("/api/user/edit-role-phone",
        {role, phone})
        console.log(result)
        setLoading(false)
        router.push("/")
    }catch(error){
      console.log(error)
      setLoading(false)
    }
  }

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
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
              <input type="text"
              placeholder='Enter Your Mobile Number'
              maxLength={10}
              required
              className='bg-white/10 border border-white/10 rounded-lg p-4 text-lg focus:outline-none
              focus:ring-2 focus:ring-[#00684D]' 
              onChange={(e) =>setPhone(e.target.value)} value={phone}/>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  {
                    roles.map((rol) =>{
                      const isAdminBlocked = rol.value == "admin" && adminExist
                      return(
                        <motion.div
                        whileHover={!isAdminBlocked ? {scale : 1.07} : {}}
                        key={rol.value}
                        onClick={() =>{
                          if(isAdminBlocked){
                            alert("⚠️ Admin already exists. You cannot select Admin role" )
                          }else {
                        setRole(rol.value) 
                      }
                        }}
                        className={`cursor-pointer p-6 text-center rounded-2xl border transition text-lg font-medium
                          ${
                            role === rol.value 
                            ? "border-[#00684D] bg-[#049770]"
                            :"border-white/20 bg-white/10 hover:bg-[#00684D]"
                          }
                          ${isAdminBlocked && "opacity-40 cursor-not-allowed"}
                          `}>
                            <div className='flex justify-center mb-3'>{rol.icon}</div>
                            <p>{rol.value}</p>

                            {isAdminBlocked && <p className='text-xs text-red-400 mt-2'>Admin already exists</p>}
                        </motion.div>
                      )
                    })
                  }
              </div>
               <motion.button
            disabled={loading}
        type='submit'
        whileHover={{scale: 1.03}}
        whileTap={{scale: 0.95}}
        className='mt-4 px-4 py-3 bg-[#00684D] hover:bg-[#049770] top-61 rounded-xl font-medium 
        flex items-center justify-center gap-1 w-full'
        >
          {loading ? <ClipLoader size={20} color='white'/>: "Submit Now "}
        </motion.button>
            </form>
      </motion.div>
      </AnimatePresence>
      
    </div>
  )
}

export default EditRoleAndPhone
