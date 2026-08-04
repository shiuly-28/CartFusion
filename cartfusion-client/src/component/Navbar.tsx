"use client"
import React, { useState } from 'react'
import { IUser } from '@/model/user.model'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from "motion/react"
import logo from '@/assets/logo.jpg.png'
import { AiOutlineLogin, AiOutlineLogout, AiOutlineMenu, AiOutlinePhone, AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { IconType } from 'react-icons';
import { signOut } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface NavItemProps {
  label: string;
  path: string;
  router: ReturnType<typeof useRouter>;
}

// 🌟 IconBtn-এর জন্য টাইপ
interface IconBtnProps {
  Icon: IconType;
  onClick?: () => void;
}

interface DropDownBtnProps {
  Icon?: IconType;  
  label?: string;   
  onClick?: () => void;
  close?: () => void;
}

// cart Btn
interface CartBtnProps {
  router: AppRouterInstance; // অথবা ReturnType<typeof useRouter>
  count: number;
}

function Navbar({ user }: { user: IUser }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg'>
      {/* logo */}
      <div className='max-w-7xl mx-auto px-6 py-3 flex justify-between items-center'>
        <div 
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => router.push("/")}
        >
          <Image src={logo} width={30} height={30} alt='logo' className='rounded-full'/>
          <span className='text-xl font-semibold hidden sm:inline hover:text-[#049770] transition'>
            CartFusion
          </span>
        </div>

        {user?.role === 'user' && (
          <div className='hidden md:flex gap-8'>
            <NavItem label="Home" path="/" router={router}/>
            <NavItem label="Category" path="/category" router={router}/>
            <NavItem label="Shop" path="/shop" router={router}/>
            <NavItem label="Orders" path="/orders" router={router}/>
          </div>
        )}

        {/* desktop icon */}
        <div className='hidden md:flex items-center gap-6'>
          {user?.role === 'user' && (
            <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/category")}/>
          )}
          <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")}/>

          <div className='relative'>
            {user?.image ? (
              <Image 
                src={user.image} 
                alt='user' 
                width={32} 
                height={32}
                className='w-8 h-8 rounded-full object-cover border border-gray-700 cursor-pointer' 
                onClick={() => setOpenMenu(!openMenu)}
              />
            ) : user?.name ? (
              <div 
                onClick={() => setOpenMenu(!openMenu)} 
                className='w-8 h-8 rounded-full bg-[#049770] text-white font-semibold flex items-center justify-center cursor-pointer uppercase'
              >
                {user.name.trim()[0]}
              </div>
            ) : (
              <IconBtn Icon={AiOutlineUser} onClick={() => setOpenMenu(!openMenu)}/>
            )}

            <AnimatePresence>
              {openMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className='absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c] p-2'
                >
                  <DropDownBtn Icon={AiOutlineUser} label="Profile" onClick={()=>{router.push("/profile"); setOpenMenu(false)}}/>
                  <DropDownBtn Icon={AiOutlineLogin} label="SignIn" onClick={()=>{router.push("/login"); setOpenMenu(false)}}/>
                  <DropDownBtn Icon={AiOutlineLogout} label="SignOut" onClick={()=>{signOut; setOpenMenu(false)}}/>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
          {user?.role == "user" && <CartBtn router={router} count={5}/>}
        </div>
        {/* mobile icon */}
        <div>
          {user?.role == "merchant" || user?.role == "admin" ? (
            <>
            <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")}/>
           <div className='relative'>
            {user?.image ? (
              <Image 
                src={user.image} 
                alt='user' 
                width={32} 
                height={32}
                className='w-8 h-8 rounded-full object-cover border border-gray-700 cursor-pointer' 
                onClick={() => setOpenMenu(!openMenu)}
              />
            ) : user?.name ? (
              <div 
                onClick={() => setOpenMenu(!openMenu)} 
                className='w-8 h-8 rounded-full bg-[#049770] text-white font-semibold flex items-center justify-center cursor-pointer uppercase'
              >
                {user.name.trim()[0]}
              </div>
            ) : (
              <IconBtn Icon={AiOutlineUser} onClick={() => setOpenMenu(!openMenu)}/>
            )}

            <AnimatePresence>
              {openMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className='absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c] p-2'
                >
                  <DropDownBtn Icon={AiOutlineUser} label="Profile" onClick={()=>{router.push("/profile"); setOpenMenu(false)}}/>
                  <DropDownBtn Icon={AiOutlineLogin} label="SignIn" onClick={()=>{router.push("/login"); setOpenMenu(false)}}/>
                  <DropDownBtn Icon={AiOutlineLogout} label="SignOut" onClick={()=>{signOut; setOpenMenu(false)}}/>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
            </>
          ):(
            <>
           <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/category")}/>
           <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")}/>
            <CartBtn router={router} count={5}/>
            <AiOutlineMenu/>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

// Sub Components
const NavItem = ({ label, path, router }: NavItemProps) => (
  <motion.button 
    whileHover={{ scale: 1.1 }}
    onClick={() => router.push(path)} 
    className='hover:text-[#049770] font-medium transition cursor-pointer'
  >
    {label}
  </motion.button>
)

const IconBtn = ({ Icon, onClick }: IconBtnProps) => (
  <motion.button whileHover={{ scale: 1.1 }} onClick={onClick} className="cursor-pointer">
    <Icon size={24}/>
  </motion.button>
)

const DropDownBtn = ({ Icon, label, onClick, }: DropDownBtnProps) => (
  <button 
    onClick={() => {
      if (onClick) onClick();
   
    }} 
    className='flex items-center gap-2 w-full px-3 py-2 text-left
     hover:bg-white/10 rounded-md transition cursor-pointer'
  >
    {Icon && <Icon size={18}/>}
    {label && <span>{label}</span>}
  </button>
)

const CartBtn = ({ router, count }: CartBtnProps) => (
  <motion.button whileHover={{ scale: 1.1 }} onClick={()=>router.push("/cart")}
   className="relative">
    <AiOutlineShoppingCart size={24}/>

    {count >0 && <span className='absolute -top-2 -right-2 bg-[#00684D] text-white text-xs
    rounded-full px-1'>
      {count}</span>}
  </motion.button>
)