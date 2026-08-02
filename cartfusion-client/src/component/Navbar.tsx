"use client"
import React from 'react'
import { IUser } from '@/model/user.model'
import Image from 'next/image';
import { useRouter } from 'next/navigation'

import logo from '@/assets/logo.jpg.png'

interface NavItemProps {
  label: string;
  path: string;
  router: ReturnType<typeof useRouter>;
}

function Navbar({user} : {user: IUser}) {
  const router = useRouter();

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
    </div>
    </div>
  )
}

export default Navbar

const NavItem = ({ label, path, router }: NavItemProps) => (
  <button 
    onClick={() => router.push(path)} 
    className='hover:text-[#049770] font-medium transition'
  >
    {label}
  </button>
)
