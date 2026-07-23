"use client"
import React, { useState } from 'react';
import { AnimatePresence, motion } from "motion/react"
import { RiContractLeftRightLine } from 'react-icons/ri';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

const Login= () => {
    const [step, setStep] = useState<1 | 2>(2)
      const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [showPassword, setShowPassword] = useState(false)
        const router = useRouter()
        const  [loading, setLoading] = useState(false)
        const session = useSession()
        console.log(session.data?.user)

        const handleSignIn = async (e:React.FormEvent) => {
          setLoading(true)
          e.preventDefault()
          try{
            const result = await signIn("credentials",{
              email,
              password,
              redirect:false
            })
            alert("SignIn Successfully")
            router.push("/")
            setLoading(false)
          }
        catch(error){
          console.log(error)
          setLoading(false)
          alert(error)
        }
      }
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white p-6'>
       <AnimatePresence>
        {step == 2 &&<motion.div
                  initial={{ opacity: 0, y:40 }}
              animate={{ opacity: 1, y:0 }}
              exit={{ opacity: 0, y:-40 }}
              transition={{duration:0.5}}
              className='w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl
              p-8 border border-white/20'
              >
                <h1 className='text-2xl font-semibold text-center mb-6 text-white'>Welcome Back to <span className='text-[#049770]'>CartFution</span></h1>
                <form onSubmit={handleSignIn} className='flex flex-col gap-4'>
        
                 
        
                  <input type="text"
                  required
                  placeholder='Email'
                  className='bg-white/10 border border-white/30 rounded-lg p-3
                  focus:outline-none focus:ring-2 focus:ring-[#00684D]' 
                  onChange={(e) =>setEmail(e.target.value)} value={email}/>
        
                
                 <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            required
            placeholder='password'
            className='bg-white/10 border border-white/30 rounded-lg p-3 w-full
            focus:outline-none focus:ring-2 focus:ring-[#00684D]' 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition'
          >
            {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
          </button>
        </div>
        
                    <motion.button
                    disabled={loading}
                type='submit'
                whileHover={{scale: 1.03}}
                whileTap={{scale: 0.95}}
                className='mt-4 px-4 py-3 bg-[#00684D] hover:bg-[#049770] top-61 rounded-xl font-medium 
                flex items-center justify-center gap-1 w-full'
                >
                  {loading ? <ClipLoader size={20} color='white'/>: "Login Now "}
                </motion.button>
                  
                  <div className='flex items-center my-3'>
                    <div className='flex-1 h-px bg-gray-600'></div>
                    <span className='px-3 text-sm text-gray-400'>or</span>
                    <div className='flex-1 h-px  bg-gray-600'></div>
                  </div>
        
                  <motion.button
             
                whileHover={{scale: 1.03}}
                whileTap={{scale: 0.95}}
                className='flex items-center py-3 bg-white/10 hover:bg-white/20 border border-white/30 top-61 rounded-xl font-medium 
                 justify-center gap-3 w-full transition'
                ><FcGoogle className='w-5 h-5' />
                  <span className='font-medium'>Continue With Google</span>
                </motion.button>
                <p className='text-center text-sm mt-4 text-gray-400'>Create a new account{" "}
                  <span onClick={()=>router.push("/register")}
                  className='text-[#00684D] hover:text-[#049770] hover:underline transition'>signUp</span>
                </p>
                </form>
              </motion.div>}
       </AnimatePresence>
        </div>
    );
};

export default Login;