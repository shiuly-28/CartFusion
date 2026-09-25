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
  
  // ইউজার লগইন অবস্থায় থাকলে DB থেকে ডাটা আনা হবে
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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans flex-col'>
      <Navbar user={plainUser} />
      
      {/* ইউজার না থাকলে বা লগইন না থাকলেও ডিফল্ট Dashboard/Landing Page দেখাবে */}
      {user?.role === "merchant" ? (
        <MerchantPage user={plainUser} />
      ) : user?.role === "admin" ? (
        <AdminDashBoard />
      ) : (
        <UserDashBoard /> // অথবা লগইন ছাড়া কোনো গেস্ট ল্যান্ডিং পেজ থাকলে সেটা
      )}

      <Footer user={plainUser} />
    </div>
  )
}