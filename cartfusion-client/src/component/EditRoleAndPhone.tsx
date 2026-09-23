// "use client"
// import React, { useState } from 'react'
// import { AnimatePresence, motion } from "motion/react"
// import axios from 'axios'
// import { ClipLoader } from 'react-spinners'
// import { useRouter } from 'next/navigation'

// function EditRoleAndPhone() {
//   const [phone, setPhone] = useState<string>("")
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!phone) {
//       alert("Please enter your phone number")
//       return;
//     }
//     setLoading(true)
//     try {
//       // বাই-ডিফল্ট role হিসেবে 'user' পাঠানো হচ্ছে
//       const result = await axios.post("/api/user/edit-role-phone", {
//         role: "user",
//         phone
//       })
//       console.log(result)
//       setLoading(false)
//       router.push("/")
//     } catch (error) {
//       console.log(error)
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6'>
//       <AnimatePresence>
//         <motion.div
//           initial={{ opacity: 0, y: -40 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -40 }}
//           transition={{ duration: 0.5 }}
//           className='w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10'
//         >
//           <h1 className='text-3xl font-semibold text-center mb-2'>Complete Your Profile</h1>
//           <p className='text-center text-gray-300 mb-8 text-sm'>
//             Enter your phone number to finish setting up your account
//           </p>

//           <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
//             <div>
//               <label className='block text-xs text-gray-300 mb-2 font-medium'>Phone Number</label>
//               <input
//                 type="text"
//                 placeholder='Enter Your Mobile Number'
//                 maxLength={11}
//                 required
//                 className='w-full bg-white/10 border border-white/20 rounded-xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#00684D] text-white placeholder-gray-400'
//                 onChange={(e) => setPhone(e.target.value)}
//                 value={phone}
//               />
//             </div>

//             <motion.button
//               disabled={loading}
//               type='submit'
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className='mt-2 px-4 py-3 bg-[#00684D] hover:bg-[#049770] rounded-xl font-medium flex items-center justify-center gap-1 w-full transition'
//             >
//               {loading ? <ClipLoader size={20} color='white' /> : "Submit Now"}
//             </motion.button>
//           </form>
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   )
// }

// export default EditRoleAndPhone