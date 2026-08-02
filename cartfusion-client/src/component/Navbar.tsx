"use client"
import React from 'react'
import { IUser } from '@/model/user.model'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from "motion/react"
import logo from '@/assets/logo.jpg.png'
import { AiOutlinePhone, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';

interface NavItemProps {
  label: string;
  path: string;
  router: ReturnType<typeof useRouter>;
}

function Navbar({user} : {user: IUser}) {
  const router = useRouter();

  console.log("Current User Data:", user);

  return (
    <div className='fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg'>
      {/*logo*/}
      <div className='max-w-7xl mx-auto px-6 py-3 flex justify-between'
      >
        <div className='flex items-center gap-2 cursor-pointer'
        onClick={() => router.push("/")}>
        <Image src={logo} width={30} height={30} alt='logo'
        className='rounded-full'/>
        <span className='text-xl font-semibold hidden 
        sm:inline hover:text-[#049770]'>Cartfuition</span>
    </div>
      {user.role == 'user' && <div className='hidden md:flex gap-8'>
          <NavItem label="Home" path="/" router={router}/>
          <NavItem label="Category" path="/category" router={router}/>
          <NavItem label="Shop" path="/shop" router={router}/>
          <NavItem label="Orders" path="/orders" router={router}/>
          </div>}

          {/* desktop icon */}
          <div className='hidden md:flex items-center gap-6'>
           {user?.role == 'user' && 
             <IconBtn Icon={AiOutlineSearch} onClick={()=>router.push("/category")}/>}
             <IconBtn Icon={AiOutlinePhone} onClick={()=>router.push("/support")}/>

              <div className='relative'>
                {user?.image ? <Image src={user?.image} alt='user' width={30} height={30}
                className='w-10 h-10 rounded-full object-cover
                 border border-gray-700 cursor-pointer'/>

                : <IconBtn Icon={AiOutlineUser}/>}
              </div>
          </div>
    </div>
    </div>
  )
}

export default Navbar

// components
const NavItem = ({ label, path, router }: NavItemProps) => (
  <motion.button whileHover={{scale: 1.1}}
    onClick={() => router.push(path)} 
    className='hover:text-[#049770] font-medium transition'
  >
    {label}
  </motion.button>
)

const IconBtn = ({Icon, onClick}:  any)=> (
  <motion.button whileHover={{scale: 1.1}} onClick={onClick}>
    <Icon size={24}/>
  </motion.button>
)
