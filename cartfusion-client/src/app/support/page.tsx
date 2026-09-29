"use client"

import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaPaperPlane, FaUserCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

interface Message {
  sender: string;
  text: string;
  createAt: string;
}

function SupportChats() {
  const router = useRouter()
  const { userData } = useSelector((state: RootState) => state.user)
  const myId = String(userData?._id)
  const [users, setUsers] = useState<IUser[]>()
  const [activeUser, setActiveUser] = useState<IUser>()
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

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

  useEffect(() => {
    if (!activeUser?._id) return; 
    const fetchChatMessages = async () => {
      try {
        const result = await axios.post("/api/support/get", { withUserId: activeUser?._id })
        console.log(result.data)
        setMessages(result.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchChatMessages()
  }, [activeUser])

  if (!myId) {
    return (
      <div className='min-h-screen flex items-center bg-white justify-center text-gray-500'>
        Loading support...
      </div>
    )
  }

  const sendMessage = async () => {
    if (!text.trim() || !activeUser) return;
    try {
      await axios.post("/api/support/send", { reciverId: activeUser._id, text })
      setMessages((prev) => [
        ...prev,
        {
          sender: myId,
          text,
          createAt: new Date().toISOString()
        },
      ]);
      setText("");
    } catch (error) {
      console.log(error)
    }
  }

  const getSuggestions = async () => {
    if (!messages.length || !activeUser || !userData?.role) return;

    const lastMessage = messages[messages.length - 1];

    setLoadingSuggestions(true)
    try {
      const result = await axios.post("/api/support/aiSuggestions", {
        message: lastMessage.text,
        role: userData.role,
        targetRole: activeUser.role
      })
      console.log(result.data.suggestions)
      setSuggestions(result.data.suggestions)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  return (
    <div className='min-h-screen bg-white p-3 sm:p-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 h-[90vh]'>
        <div className='bg-white border border-gray-200 shadow-sm rounded-2xl p-4 overflow-y-auto'>
          
          {/* Header with Back Button */}
          <div className='flex items-center gap-3 mb-4'>
            <button
              onClick={() => router.back()}
              className='p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center justify-center'
              title="Go Back"
            >
              <FaArrowLeft className='text-sm' />
            </button>
            <h2 className='text-gray-900 font-semibold text-lg'>Support Chats</h2>
          </div>

          {/* Role specific Notice */}
          {userData?.role && (
            <p className='text-xs text-[#00684D] bg-[#00684D]/10 p-3 my-1 rounded-xl leading-relaxed'>
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
            <p className='text-gray-500 text-sm text-center mt-4'>No Active User Found</p>
          ) : (
            <div className='space-y-3 mt-3'>
              {users?.map((u, i) => (
                <div
                  key={u._id ? String(u._id) : i}
                  onClick={() => setActiveUser(u)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    activeUser?._id === u._id
                      ? "bg-[#00684D] border border-[#045f47] shadow-md"
                      : "hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {/* User Avatar Circle */}
                  <div className='w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100'>
                    {u.image ? (
                      <Image
                        src={u.image}
                        alt={u.name || "User Avatar"}
                        width={48}
                        height={48}
                        className='object-cover w-full h-full'
                      />
                    ) : (
                      <FaUserCircle className={`w-12 h-12 ${activeUser?._id === u._id ? "text-white/70" : "text-gray-400"}`} />
                    )}
                  </div>

                  {/* User Details Section */}
                  <div className='min-w-0 flex-1'>
                    <p className={`text-sm font-medium truncate ${activeUser?._id === u._id ? "text-white" : "text-gray-900"}`}>
                      {u.name}
                    </p>
                    <p className={`text-xs truncate capitalize ${activeUser?._id === u._id ? "text-white/80" : "text-gray-500"}`}>
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

        <div className='md:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col overflow-hidden'>
          {!activeUser ? (
            <div className='flex-1 flex items-center justify-center text-gray-400'>
              Select a chat to start conversation
            </div>
          ) : (
            <>
              <div className='flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50'>
                {messages.map((msg, i) => {
                  const isMe = msg.sender === myId;
                  const avatarUser = isMe ? userData : activeUser;

                  return (
                    <div key={i}
                      className={`flex items-end gap-3 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}>
                      {!isMe && (
                        <div className='w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0'>
                          {avatarUser?.image ? (
                            <Image
                              src={avatarUser.image}
                              alt='user'
                              width={36}
                              height={36}
                              className='object-cover' />
                          ) : (
                            <FaUserCircle className='text-gray-400 w-9 h-9' />
                          )}
                        </div>
                      )}

                      <div className={`max-w-[70%] px-4 py-2.5 text-sm rounded-2xl ${
                        isMe
                          ? "bg-[#00684D] text-white rounded-br-sm"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                      }`}>
                        {msg.text}
                      </div>

                      {isMe && (
                        <div className='w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0'>
                          {avatarUser?.image ? (
                            <Image
                              src={avatarUser.image}
                              alt='user'
                              width={36}
                              height={36}
                              className='object-cover' />
                          ) : (
                            <FaUserCircle className='text-gray-400 w-9 h-9' />
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className='px-4 pt-2 bg-white'>
                <button
                  onClick={getSuggestions}
                  disabled={loadingSuggestions}
                  className='relative inline-block text-xs px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 disabled:opacity-50 transition z-50'>
                  {loadingSuggestions ? <ClipLoader size={16} color='#7e22ce' /> : "Get AI Suggestions"}
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className='px-4 pb-2 pt-2 flex flex-wrap gap-2 bg-white'>
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => setText(s)}
                      className='text-xs px-3 py-1 rounded-full bg-[#00684D]/10 text-[#00684D] hover:bg-[#00684D]/20 border border-[#00684D]/20 cursor-pointer transition'>
                      {s}
                    </div>
                  ))}
                </div>
              )}

              <div className='p-3 border-t border-gray-200 bg-white flex gap-2'>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Type your message....'
                  className='flex-1 bg-gray-50 text-gray-900 border border-gray-200 rounded-full px-5 py-2.5 outline-none focus:border-[#00684D] focus:bg-white'
                />
                <button
                  onClick={sendMessage}
                  className='bg-[#00684D] hover:bg-[#045f47] w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition'>
                  <FaPaperPlane className='text-white text-sm' />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupportChats