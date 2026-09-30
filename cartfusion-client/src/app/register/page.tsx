/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from 'react'
import { motion } from "motion/react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { signIn } from 'next-auth/react'

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSignUp = async(e:React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      try {
        const result = await axios.post("/api/auth/register", { name, email, password })
        console.log(result.data)
        setLoading(false)
        setName("")
        setEmail("")
        setPassword("")
        router.push("/login")
      } catch(error) {
        console.log(error)
        setLoading(false)
      }
    }
    
  return (
    <div className='min-h-screen flex items-center justify-center bg-white text-gray-900 p-6'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200'
      >
        <h1 className='text-2xl font-semibold text-center mb-6 text-[#00684D]'>Create your Account</h1>
        
        <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
          <input 
            type="text"
            required
            placeholder='Full Name'
            className='bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00684D]' 
            onChange={(e) => setName(e.target.value)} 
            value={name}
          />

          <input 
            type="email"
            required
            placeholder='Email'
            className='bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00684D]' 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
          />

          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              required
              placeholder='Password'
              className='bg-white border border-gray-300 text-gray-900 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#00684D]' 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition'
            >
              {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
            </button>
          </div>

          <motion.button
            disabled={loading}
            type='submit'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='mt-2 px-4 py-3 bg-[#00684D] hover:bg-[#045f47] text-white rounded-xl font-medium flex items-center justify-center gap-1 w-full transition'
          >
            {loading ? <ClipLoader size={20} color='white'/> : "Register Now"}
          </motion.button>
          
          <div className='flex items-center my-3'>
            <div className='flex-1 h-px bg-gray-200'></div>
            <span className='px-3 text-sm text-gray-400'>or</span>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          <motion.button
            type='button'
            onClick={() => signIn("google", { callbackUrl: "/" })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='flex items-center py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl font-medium justify-center gap-3 w-full transition'
          >
            <FcGoogle className='w-5 h-5' />
            <span className='font-medium'>Continue With Google</span>
          </motion.button>

          <p className='text-center text-sm mt-4 text-gray-500'>
            Already have an account?{" "}
            <span 
              onClick={() => router.push("/login")}
              className='text-[#00684D] hover:text-[#045f47] hover:underline transition cursor-pointer font-medium'
            >
              Sign In
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Register