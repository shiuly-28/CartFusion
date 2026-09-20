"use client"

import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'

function SupportChats() {
  const { userData } = useSelector((state: RootState) => state.user)
  const myId = String(userData?._id)
  const [users, setUsers] = useState<IUser[]>()
  const [activeUser, setActiveUser] = useState<IUser>()
  const [text, setText] = useState("")

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const result = await axios.get("/api/support/active-users")
        console.log(result.data)
        setUsers(result.data)
      } catch (error) {
        console.log(error)
        alert("failed to get active users")
      }
    }
    fetchChatUsers()
  }, [])

  if (!myId) {
    return (
      <div className='min-h-screen flex items-center bg-black justify-center text-white'>
        Loading support...
      </div>
    )
  }

  const sendMessage = async () =>{
    try{

    }catch(error){

    }
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-3 sm:p-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 h-[90vh]'>
        <div className='bg-black/50 border border-white/10 rounded-2xl p-4 overflow-y-auto'>
          <h2 className='text-white font-semibold mb-4 text-lg'>Support Chats</h2>

          {/* Role specific Notice */}
          {userData?.role && (
            <p className='text-xs text-[#90e0cb] bg-[#03684d] p-3 my-1 rounded-xl leading-relaxed'>
              {userData.role === "user" && (
                <>
                  Note: The merchant response may take 1-2 hours.
                  In some cases, you may receive a reply sooner.
                </>
              )}
              {userData.role === "merchant" && (
                <>
                  Note: The merchant response may take 1-2 hours.
                  In some cases, you may receive a reply sooner.
                </>
              )}
              {userData.role === "admin" && (
                <>
                  Note: Welcome Admin Support Panel.
                </>
              )}
            </p>
          )}

          {users?.length === 0 ? (
            <p className='text-gray-400 text-sm text-center mt-4'>No Active User Found</p>
          ) : (
            <div className='space-y-3 mt-3'>
              {users?.map((u, i) => (
                <div
                  key={u._id ? String(u._id) : i}
                  onClick={() => setActiveUser(u)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    activeUser?._id === u._id
                      ? "bg-[#00684D] border border-[#045f47] shadow-lg"
                      : "hover:bg-white/5 border border-gray-700/50"
                  }`}
                >
                  {/* User Avatar Circle */}
                  <div className='w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0'>
                    {u.image ? (
                      <Image
                        src={u.image}
                        alt={u.name || "User Avatar"}
                        width={48}
                        height={48}
                        className='object-cover w-full h-full'
                      />
                    ) : (
                      <FaUserCircle className='text-gray-400 w-12 h-12' />
                    )}
                  </div>

                  {/* User Details Section (ডিভের বাহিরে আনা হয়েছে) */}
                  <div className='min-w-0 flex-1'>
                    <p className='text-white text-sm font-medium truncate'>
                      {u.name}
                    </p>
                    <p className='text-xs text-gray-400 truncate capitalize'>
                      {u.role === "admin"
                        ? "Admin Support"
                        : u.shopName || u.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='md:col-span-2 bg-black/50 border border-white/10 rounded-2xl flex flex-col overflow-hidden'>
        {!activeUser ? (
            <div className='flex-1 flex items-center justify-center text-gray-400'>
                Select a chat to start conversation
            </div>
        ):(
            <>
            <div className='flex-1 p-4 space-y-4 overflow-y-auto'>

            </div>
            <div className='px-4 pb-2'>
                <button className='text-xs px-4 py-1.5 rounded-full
            bg-purple-600/20 text-purple-300 border border-purple-500/30
            hover:bg-purple-500/30 disabled:opacity-50 transition z-50'>
                Get AI Suggestions
            </button>
            </div>
            <div>
              
            </div>
            </>
            )}
        </div>
      </div>
    </div>
  )
}

export default SupportChats