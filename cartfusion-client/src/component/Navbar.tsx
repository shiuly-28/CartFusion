"use client"
import React, { useState } from 'react'
import { IUser } from '@/model/user.model'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from "motion/react"
import logo from '@/assets/logo.jpg.png'
import { 
  AiOutlineClose, 
  AiOutlineHome, 
  AiOutlineLogin, 
  AiOutlineLogout, 
  AiOutlineMenu, 
  AiOutlinePhone, 
  AiOutlineSearch, 
  AiOutlineShoppingCart, 
  AiOutlineUser,
  AiOutlineAppstore,
  AiOutlineShopping,
  AiOutlineUnorderedList
} from 'react-icons/ai';
import { IconType } from 'react-icons';
import { signOut } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface NavItemProps {
  label: string;
  path: string;
  router: AppRouterInstance;
}

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

interface CartBtnProps {
  router: AppRouterInstance;
  count: number;
}

interface SidebarBtnProps {
  label: string;
  path: string;
  Icon: IconType;
  router: AppRouterInstance;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavbarProps {
  user: IUser;
  cartCount?: number;
}

function Navbar({ user, cartCount }: NavbarProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const finalCartCount = cartCount ?? (user?.cart?.length || 0);

  return (
    <div className='fixed top-0 left-0 w-full bg-white text-gray-900 z-50 border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
        
        {/* LOGO */}
        <div 
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => router.push("/")}
        >
          <Image src={logo} width={30} height={30} alt='logo' className='rounded-full'/>
          <span className='text-xl font-bold hidden sm:inline tracking-tight'>
            CartFusion
          </span>
        </div>

        {/* DESKTOP NAV LINKS */}
        {user?.role === 'user' && (
          <div className='hidden md:flex gap-8'>
            <NavItem label="Home" path="/" router={router}/>
            <NavItem label="Categories" path="/category" router={router}/>
            <NavItem label="Shop" path="/shop" router={router}/>
            <NavItem label="Orders" path="/orders" router={router}/>
          </div>
        )}

        {/* DESKTOP ICONS */}
        <div className='hidden md:flex items-center gap-6'>
          {user?.role === 'user' && (
            <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/category")}/>
          )}
          <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")}/>

          {/* USER AVATAR & DROPDOWN */}
          <div className='relative'>
            {user?.image ? (
              <Image 
                src={user.image} 
                alt='user' 
                width={32} 
                height={32}
                className='w-8 h-8 rounded-full object-cover border border-gray-200 cursor-pointer' 
                onClick={() => setOpenMenu(!openMenu)}
              />
            ) : user?.name ? (
              <div 
                onClick={() => setOpenMenu(!openMenu)} 
                className='w-8 h-8 rounded-full bg-[#00684D] text-white font-semibold flex items-center justify-center cursor-pointer uppercase'
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
                  transition={{ duration: 0.2 }}
                  className='absolute right-0 mt-3 w-48 rounded-xl shadow-lg border border-gray-100 bg-white p-2 z-50'
                >
                  <DropDownBtn Icon={AiOutlineUser} label="Profile" onClick={() => { router.push("/profile"); setOpenMenu(false); }}/>
                  {!user ? (
                    <DropDownBtn Icon={AiOutlineLogin} label="SignIn" onClick={() => { router.push("/login"); setOpenMenu(false); }}/>
                  ) : (
                    <DropDownBtn Icon={AiOutlineLogout} label="SignOut" onClick={() => { signOut(); setOpenMenu(false); }}/>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Cart Badge (Desktop) */}
          {user?.role === "user" && <CartBtn router={router} count={finalCartCount} />}
        </div>

        {/* MOBILE SECTION */}
        <div className='flex md:hidden items-center gap-4'>
          {user?.role === "user" && (
            <>
              <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/category")}/>
              {/* Dynamic Cart Badge (Mobile) */}
              <CartBtn router={router} count={finalCartCount} />
            </>
          )}

          <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")}/>
          
          {/* HAMBURGER MENU BUTTON */}
          <AiOutlineMenu size={26} className='cursor-pointer text-gray-700 hover:text-[#00684D]' onClick={() => setSidebarOpen(true)}/>

          {/* MOBILE SIDEBAR & OVERLAY */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                />

                <motion.div 
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className='fixed top-0 right-0 h-dvh max-h-screen w-[75%] max-w-xs bg-white p-5 text-gray-900 z-50 shadow-2xl flex flex-col justify-between overflow-y-auto'
                >
                  <div>
                    <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                      <h1 className='text-lg font-semibold text-[#00684D]'>Menu</h1>
                      <AiOutlineClose size={24} className='cursor-pointer text-gray-500 hover:text-red-500' onClick={() => setSidebarOpen(false)}/>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <SidebarBtn label="Home" Icon={AiOutlineHome} path="/" router={router} setSidebarOpen={setSidebarOpen}/>
                      <SidebarBtn label="Category" Icon={AiOutlineAppstore} path="/category" router={router} setSidebarOpen={setSidebarOpen}/>
                      <SidebarBtn label="Shop" Icon={AiOutlineShopping} path="/shop" router={router} setSidebarOpen={setSidebarOpen}/>
                      <SidebarBtn label="Orders" Icon={AiOutlineUnorderedList} path="/orders" router={router} setSidebarOpen={setSidebarOpen}/>
                      <SidebarBtn label="Profile" Icon={AiOutlineUser} path="/profile" router={router} setSidebarOpen={setSidebarOpen}/>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-100">
                    {user ? (
                      <button 
                        onClick={() => { signOut(); setSidebarOpen(false); }}
                        className="flex items-center justify-center gap-3 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition font-medium"
                      >
                        <AiOutlineLogout size={20}/>
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => { router.push("/login"); setSidebarOpen(false); }}
                        className="flex items-center justify-center gap-3 w-full px-4 py-2.5 bg-[#00684D] text-white rounded-lg hover:bg-[#045f47] transition font-medium"
                      >
                        <AiOutlineLogin size={20}/>
                        <span>Sign In</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}

export default Navbar

// Sub Components
const NavItem = ({ label, path, router }: NavItemProps) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    onClick={() => router.push(path)} 
    className='text-gray-700 hover:text-[#00684D] font-medium transition cursor-pointer'
  >
    {label}
  </motion.button>
)

const IconBtn = ({ Icon, onClick }: IconBtnProps) => (
  <motion.button whileHover={{ scale: 1.1 }} onClick={onClick} className="cursor-pointer text-gray-700 hover:text-[#00684D]">
    <Icon size={24}/>
  </motion.button>
)

const DropDownBtn = ({ Icon, label, onClick }: DropDownBtnProps) => (
  <button 
    onClick={onClick} 
    className='flex items-center gap-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition cursor-pointer'
  >
    {Icon && <Icon size={18}/>}
    {label && <span>{label}</span>}
  </button>
)

const CartBtn = ({ router, count }: CartBtnProps) => (
  <motion.button 
    whileHover={{ scale: 1.1 }} 
    onClick={() => router.push("/cart")}
    className="relative cursor-pointer text-gray-700 hover:text-[#00684D]"
  >
    <AiOutlineShoppingCart size={24}/>
    {count > 0 && (
      <span className='absolute -top-2 -right-2 bg-[#00684D] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
        {count}
      </span>
    )}
  </motion.button>
)

const SidebarBtn = ({ label, path, router, Icon, setSidebarOpen }: SidebarBtnProps) => (
  <button 
    className='flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-[#00684D] hover:text-white text-left transition w-full' 
    onClick={() => {
      router.push(path);
      setSidebarOpen(false);
    }}
  >
    <Icon size={20}/>
    <span>{label}</span>
  </button>
)