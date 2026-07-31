import { auth } from '@/auth'
import EditRoleAndPhone from '@/component/EditRoleAndPhone'
import Navbar from '@/component/Navbar'
import connectDb from '@/lib/connectDB'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Home() {
  await connectDb()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  if(!user){
    redirect("/login")
  }
  const inComplete = !user.role || !user.phone || (!user.phone && user.role == "user")
  if(inComplete){
    return <EditRoleAndPhone/>
  }
  return (
    <div className='flex min-h-screen items-center justify-center
     bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans flex-col'>
     <Navbar/>
    </div>
  )
}

