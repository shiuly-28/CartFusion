/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function MerchantOrders() {
  UserGetCurrentUser()
  UseGetAllOrdersData()
  const dispatch = useDispatch<AppDispatch>()
  const [otpModel, setOtpModel] = useState<any|null>(null)
  const [otp, setOtp] = useState('')

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const { userData } = useSelector((state: RootState) => state.user)
  const { allOrdersData } = useSelector((state: RootState) => state.user)

  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter((o) => String(o.productMerchant?._id) === String(userData?._id))
    : []

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem)

  const statusOptions = ["pending", "confirmed", "shipped", "delivered"];

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await axios.post("/api/order/update-status", { orderId, status })
      dispatch(setAllOrdersData(
        allOrdersData.map((o: any) => (
          o._id == orderId ? { ...o, orderStatus: status } : o
        ))
      ))
      alert("Order Status Updated")
    } catch (error) {
      console.log(error)
    }
  }

  const verifyOtp = async () => {
    try {
      await axios.post("/api/order/verify-delivery-otp", {
        orderId: otpModel._id,
        otp: otp
      })
      dispatch(setAllOrdersData(
        allOrdersData.map((o: any) => (
          o._id == otpModel._id ? { ...o, orderStatus: "delivered" } : o
        ))
      ))
      alert("Order Delivered successfully")
    } catch (error) {
      console.log(error)
      alert("Failed to verify OTP")
    }
  }

  return (
    <div className='w-full px-3 sm:px-6 lg:px-10 py-6 bg-white text-gray-900'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-xl sm:text-xl lg:text-3xl font-bold text-gray-900'>Merchant Order</h1>
        <p className='text-gray-500'>{orders.length} Orders</p>
      </div>

      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white border border-gray-200 shadow-sm rounded-xl'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50 text-gray-600 text-sm'>
            <tr>
              <th className='p-4'>Order</th>
              <th className='p-4'>Buyer</th>
              <th className='p-4'>Products</th>
              <th className='p-4'>Payment</th>
              <th className='p-4'>Status</th>
              <th className='p-4 text-center'>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-500'>
                  No Merchant Approval requests found
                </td>
              </tr>
            ) : (
              currentOrders.map((order, index) => (
                <tr key={index} className='border-t border-gray-100 hover:bg-gray-50'>
                  <td className='p-4 text-gray-700'>#{String(order._id)!.slice(-8)}</td>
                  <td className='p-4 text-gray-700'>{order.address.name}
                    <div className='text-xs text-gray-500'>{order.address.phone}</div>
                  </td>
                  <td className='p-4 text-gray-700'>
                    {order.products.map((p: any, i: number) => (
                      <div key={i}>
                        {p.product?.title} X {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className='p-4 text-gray-700'>{order.paymentMethod.toUpperCase()}
                    <div className={`text-xs ${order.isPaid ? 'text-[#00684D]' : 'text-amber-500'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                  </td>
                  <td className='p-4 text-gray-700'>{order.orderStatus.toUpperCase()}</td>
                  <td className='p-4 text-center'>
                    {order.orderStatus === "cancelled" && (
                      <span className='text-red-500 font-semibold capitalize'>Cancelled</span>
                    )}
                    {order.orderStatus === "delivered" && (
                      <span className='text-[#00684D] font-semibold capitalize'>delivered</span>
                    )}
                    {order.orderStatus === "returned" && (
                      <span className='text-orange-500 font-semibold capitalize'>Returned</span>
                    )}

                    {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && order.orderStatus !== "returned" && (
                      <select
                        onChange={async (e) => {
                          if (e.target.value === "delivered") {
                            updateStatus(String(order._id), "delivered")
                            setOtpModel(order)
                          } else {
                            updateStatus(String(order._id), e.target.value)
                          }
                        }}
                        value={order.orderStatus}
                        className='bg-white border border-gray-300 text-gray-800 w-full rounded px-2 py-1'
                      >
                        {statusOptions.map((s, i) => (
                          <option key={i} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
        {orders.length === 0 ? (
          <div className='text-center text-gray-500 mt-10'>
            No order found
          </div>
        ) : (
          currentOrders.map((order, index) => (
            <div key={index} className='bg-white border border-gray-200 shadow-sm rounded-xl p-4 space-y-2'>
              <div className='flex justify-between mb-2'>
                <span className='text-sm text-gray-700'>#{String(order._id)!.slice(-8)}</span>
                <span className='text-[#00684D] font-bold'>৳{order.totalAmount}</span>
              </div>

              <p className='text-sm text-gray-700'>
                <b className='text-gray-900'>Buyer: </b>{order.address?.name}
              </p>
              <p className='text-xs text-gray-500'>
                {order.address?.phone}
              </p>
              <div className='text-gray-700'>
                {order.products.map((p: any, i: number) => (
                  <p key={i}>
                    {p.product?.title} X {p.quantity}
                  </p>
                ))}
              </div>

              <div className='mt-3 text-sm text-gray-700'>
                <b className='text-gray-900'>Status:</b>{" "}
                <span className='capitalize'>{order.orderStatus}</span>
              </div>

              {order.orderStatus === "cancelled" && (
                <span className='text-red-500 font-semibold capitalize'>Cancelled</span>
              )}
              {order.orderStatus === "delivered" && (
                <span className='text-[#00684D] font-semibold capitalize'>delivered</span>
              )}
              {order.orderStatus === "returned" && (
                <span className='text-orange-500 font-semibold capitalize'>Returned</span>
              )}

              {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && order.orderStatus !== "returned" && (
                <select
                  onChange={async (e) => {
                    if (e.target.value === "delivered") {
                      updateStatus(String(order._id), "delivered")
                      setOtpModel(order)
                    } else {
                      updateStatus(String(order._id), e.target.value)
                    }
                  }}
                  value={order.orderStatus}
                  className='bg-white border border-gray-300 text-gray-800 w-full rounded px-2 py-1'
                >
                  {statusOptions.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      {orders.length > itemsPerPage && (
        <div className='flex items-center justify-between border-t border-gray-200 mt-6 pt-4'>
          <p className='text-xs sm:text-sm text-gray-500'>
            Showing <span className='font-medium'>{indexOfFirstItem + 1}</span> to{' '}
            <span className='font-medium'>{Math.min(indexOfLastItem, orders.length)}</span> of{' '}
            <span className='font-medium'>{orders.length}</span> orders
          </p>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='px-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
            >
              Previous
            </button>

            <span className='text-xs sm:text-sm font-semibold text-gray-800 px-2'>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='px-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
            >
              Next
            </button>
          </div>
        </div>
      )}

      {otpModel && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-gray-200'>
            <h2 className='text-lg font-semibold mb-3 text-gray-900'>Enter Delivery OTP</h2>
            <input
              type="text"
              className='w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#00684D]'
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              placeholder='Enter OTP'
            />
            <button
              onClick={verifyOtp}
              className='w-full bg-[#00684D] hover:bg-[#045f47] text-white py-2 rounded flex items-center justify-center gap-2 transition'
            >
              Verify & Deliver
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MerchantOrders;