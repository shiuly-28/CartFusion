import { auth } from '@/auth'
import AdminDashBoard from '@/component/Admin/AdminDashBoard'
import EditRoleAndPhone from '@/component/EditRoleAndPhone'
import MerchantDashBoard from '@/component/Merchant/MerchantDashBoard'
import Navbar from '@/component/Navbar'
import UserDashBoard from '@/component/User/UserDashBoard'

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
  const plainUser = JSON.parse(JSON.stringify(user))
  return (
    <div className='flex min-h-screen items-center justify-center
     bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans flex-col'>
     <Navbar user={plainUser}/>
     {user?.role == "user" ? (<UserDashBoard/>) : user?.role == "merchant" ? (<MerchantDashBoard/>)  : (<AdminDashBoard/>)}
    </div>
  )
}

