"use client"

import { AppDispatch, RootState } from '@/redux/store'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion} from 'motion/react'
import Image from 'next/image'
import { AiOutlineUser } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import userImage from "@/assets/userpng.avif"
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { setUserData } from '@/redux/userSlice'
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser'

function Profile() {
  UserGetCurrentUser()
  const user = useSelector((state:RootState)=>state.user.userData)
  const router = useRouter()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditShop, setShowEditShop] = useState(false)
  const [previewImage, setPreviewImage] = useState(user?.image || userImage )
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [shopName, setShopName] = useState(user?.shopName || "")
  const [shopAddress, setShopAddress] = useState(user?.shopAddress || "")
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || "")
   const [loading, setLoading] = useState(false)
   const dispatch = useDispatch<AppDispatch>()

  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file)return;
    setProfileImage(file)
    setPreviewImage(URL.createObjectURL(file))
  }

  const handleUpdateProfile = async () => {
    const formData = new FormData()
    formData.append("phone", phone);
    formData.append("name", name);
    if(profileImage){
      formData.append("image", profileImage)
    }
    setLoading(true)
    try{
      const result = await axios.post("/api/user/update-profile", formData)
      dispatch(setUserData(result.data))
      console.log(result)
      setLoading(false)
      setProfileImage(null)
      alert("profile update error ✅")
    }catch(error){
      console.log(error)
      setLoading(false)
      alert("Profile update error")
    }
  }
  
  const handleVerifyAgain = async () => {
    if(!shopAddress || !shopName || !gstNumber){
      alert("Fill all fields")
      return;
    }
    setLoading(true)
    try{
      const result = await axios.post("/api/merchant/verifyagain", {
        shopName,
        shopAddress, 
        gstNumber
      })
      // console.log(result.data)
      setLoading(false)
      alert("Shop Details updated ✅")
      router.push("/")
    }catch(error){
      console.log(error)
      setLoading(false)
      alert("Failed to send verification ❌")
    }
  }

  return (
    <div className='min-h-screen  bg-linear-to-br from-gray-900 
    via-black to-gray-900 text-white px-6 pt-24 pb-10'>
      <motion.div
      initial={{scale: 0.95, opacity: 0}}
      animate={{scale: 1, opacity: 1 }}
      transition={{duration: 0.4}}
      className='max-w-3xl mx-auto bg-white/10 backdrop-blur-m p-6 sm:p-10 rounded-2xl border 
      border-white/20 shadow-xl'>
        <div className='flex flex-col items-center text-center'>
          <motion.div
          whileHover={{scale:1.05}}

           className='w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-white/30
          hover:border-[#00684D]'>
            {user?.image ?(
              <Image src={user?.image}
              alt="profile"
              width={120}
              height={120}
              className='w-full h-full object-cover'/>
            ):(
              <div className='w-full h-full flex items-center justify-center bg-gray-700'>
                  <AiOutlineUser size={48} className='text-white'/>
            </div>)}
          </motion.div>
          <h2 className='text-2xl sm:text-3xl font-bold mt-4'>{user?.name}</h2>
          <p className='text-gray-400 text-sm sm:text-base'>{user?.email}</p>
          <p className='text-gray-400 text-xs sm:text-sm mt-1'>Role: {" "} <span
          className='text-[#00684D] uppercase font-semibold'>{user?.role}</span></p>
        </div>

        <div className='mt-5 sapce-y-3 text-sm sm:text-base'>
          <p><b>Phone : </b>{user?.phone || "-"}</p>

          {user?.role == "merchant" && (
            <>
             <p><b>Shop Name : </b>{user?.shopName || "-"}</p>
             <p><b>Shop Address : </b>{user?.shopAddress || "-"}</p>
             <p><b>GSTIN : </b>{user?.gstNumber || "-"}</p>
            </>
          )}
        </div>
        <div className='flex flex-col gap-3 w-full mt-4'>
          {user?.role == "user" && (
            <motion.button
            onClick={()=>router.push("/orders")}
            whileHover={{scale:1.02}}
            className='bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold'>
              My Orders
            </motion.button>
          )}
           <motion.button
           onClick={()=> {setShowEditProfile(!showEditProfile); setShowEditShop(false)}}
            whileHover={{scale:1.02}}
            className='bg-[#00684D] hover:[#045f47] py-3 rounded-lg font-semibold'>
            Edit Profile
            </motion.button>

              {user?.role == "merchant" && (
              <motion.button
                onClick={()=> {setShowEditShop(!showEditShop); setShowEditProfile(false)}}
              whileHover={{scale:1.02}}
              className='bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold'>
              Edit Shop Details
            </motion.button>
          )}
        </div>
         <AnimatePresence>
       {showEditProfile &&(
         <motion.div 
         initial={{opacity : 0, y: 30}}
         animate={{opacity: 1, y: 0 }}
         exit={{opacity: 0 , y: 30 }}
         className='mt-10 bg-white/5 p-5 sm:p-6 rounded-xl border border-white/20'>
            <h3 className='text-xl font-bold mb-3'>Edit Profile</h3>
            <div className='flex flex-col items-center mb-6'>
              <motion.div 
              whileHover={{scale: 1.05}}
              className='w-24 h-24 rounded-full overflow-hidden border-2 border-white/30
              hover:border-[#00684D] mb-3'>
                <Image src={previewImage} alt='select Image' width={120} height={120}
                className='object-cover w-full h-full'/>
              </motion.div>
              <label className='cursor-pointer bg-[#00684D] px-4 py-2 rounded-lg text-sm'>
                Select Image
                <input type="file" hidden accept='image/*' onChange={handlePreviewImage}/>
              </label>
            </div>
            <div className='space-y-4'>
              <input type="text" className='w-full p-3 bg-white/10 border border-white/20 rounded'
              placeholder='Full Name'
              onChange={(e) => setName(e.target.value)} value={name} />

              <input type="text" className='w-full p-3 bg-white/10 border border-white/20 rounded'
              placeholder='Phone'
              onChange={(e) => setPhone(e.target.value)} value={phone} />
               <motion.button
              whileHover={{scale: 1.02}}
              onClick={handleUpdateProfile}
              className='hover:bg-[#045f47] bg-[#00684D] w-full py-3 rounded-lg font-semibold'>
              {loading ? <ClipLoader size={20} color='white'/>:"Updated Profile"}
            </motion.button>
            </div>
        </motion.div>
       )}
      </AnimatePresence>

       <AnimatePresence>
       {showEditShop &&(
         <motion.div 
         initial={{opacity : 0, y: 30}}
         animate={{opacity: 1, y: 0 }}
         exit={{opacity: 0 , y: 30 }}
         className='mt-10 bg-white/5 p-5 sm:p-6 rounded-xl border border-white/20'>
            <h3 className='text-xl font-bold mb-3'>Edit Shop Details</h3>
             <div className='space-y-4'>
              <input type="text" className='w-full p-3 bg-white/10 border border-white/20 rounded'
              placeholder='Shop Name'
              onChange={(e) => setShopName(e.target.value)} value={shopName} />

              <input type="text" className='w-full p-3 bg-white/10 border border-white/20 rounded'
              placeholder='Shop Address'
              onChange={(e) => setShopAddress(e.target.value)} value={shopAddress} />
              <input type="text" className='w-full p-3 bg-white/10 border border-white/20 rounded'
              placeholder='GSTIN'
              onChange={(e) => setGstNumber(e.target.value)} value={gstNumber} />
               <motion.button
              onClick={handleVerifyAgain}
              disabled={loading}
              className='hover:bg-[#045f47] bg-[#00684D] w-full py-3 rounded-lg font-semibold'>
              {loading? <ClipLoader size={22} color='white'/> :"Updated Shop Profile"}
            </motion.button>
            </div>
        </motion.div>
       )}
      </AnimatePresence>
      </motion.div>
     
    </div>
  )
}

export default Profile