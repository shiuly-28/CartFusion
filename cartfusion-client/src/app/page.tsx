import { auth } from '@/auth'
import AdminDashBoard from '@/component/Admin/AdminDashBoard'
import Footer from '@/component/Footer'
import EditMerchantDetails from '@/component/Merchant/EditMerchantDetails'
import MerchantPage from '@/component/Merchant/MerchantPage'
import Navbar from '@/component/Navbar'
import UserDashBoard from '@/component/User/UserDashBoard'

import connectDb from '@/lib/connectDB'
import User from '@/model/user.model'
import React from 'react'

export default async function Home() {
  await connectDb()
  const session = await auth()
  
  // ইউজার লগইন অবস্থায় থাকলে DB থেকে ডাটা আনা হবে
  let user = null
  if (session?.user?.id) {
    user = await User.findById(session.user.id)
  }

  // মার্চেন্ট প্রোফাইল ইনকমপ্লিট থাকলে এডিট অপশন দেখাবে
  if (user && user?.role === "merchant") {
    const isCompleteDetails = !user.shopName || !user.shopAddress || !user.gstNumber
    if (isCompleteDetails) {
      return <EditMerchantDetails />
    }
  }

  const plainUser = user ? JSON.parse(JSON.stringify(user)) : null

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 font-sans flex-col transition-colors'>
      <Navbar user={plainUser} />
      
      
      {user?.role === "merchant" ? (
        <MerchantPage user={plainUser} />
      ) : user?.role === "admin" ? (
        <AdminDashBoard />
      ) : (
        <UserDashBoard /> 
      )}

      <Footer user={plainUser} />
    </div>
  )
}