"use client"

import { IUser } from '@/model/user.model'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react'
import logo from '@/assets/logo.jpg.png'

function Navbar({user} : {user: IUser}) {
  const router = useRouter();

  return (
    <div className='fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg'>
      {/*logo*/}
      <div className='flex items-center gap-2 cursor-pointer'
      onClick={() => router.push("/")}>
        <Image src={logo} width={30} height={30} alt='logo'
        className='rounded-full'/>
        <span>Cartfuition</span>
      </div>
    </div>
  )
}

export default Navbar
