/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import { RootState } from '@/redux/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const statusStyles: Record<string, string> = {
  cancelled: 'text-red-600',
  pending: 'text-yellow-600',
  confirmed: 'text-pink-600',
  shipped: 'text-indigo-600',
  delivered: 'text-[#00684D]',
  returned: 'text-orange-600',
}

function UserOrders() {
  UseGetAllOrdersData()
  const { allOrdersData } = useSelector((state: RootState) => state.user)

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const orders = Array.isArray(allOrdersData) ? allOrdersData : []

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem)

  const formateDate = (date: string) => {
    if (!date) return
    const d = new Date(date)
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className='w-full min-h-screen px-3 sm:px-6 lg:px-10 py-6 bg-gray-50 text-gray-900'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-xl lg:text-3xl font-bold text-gray-900'>Merchant Order</h1>
        <p className='text-gray-600'>{orders.length} Orders</p>
      </div>

      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white rounded-xl border border-gray-200 shadow-sm'>
        <table className='w-full text-left'>
          <thead className='bg-gray-100 text-gray-700'>
            <tr>
              <th className='p-4'>Order ID</th>
              <th className='p-4'>Buyer</th>
              <th className='p-4'>Merchant</th>
              <th className='p-4'>Products</th>
              <th className='p-4'>Amount</th>
              <th className='p-4'>Payment</th>
              <th className='p-4'>Status</th>
              <th className='p-4'>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className='p-6 text-center text-gray-500'>
                  No order found
                </td>
              </tr>
            ) : (
              currentOrders.map((order, index) => (
                <tr key={index} className='border-t border-gray-200 hover:bg-gray-50'>
                  <td className='p-4 text-sm'>#{String(order._id)!.slice(-8)}</td>
                  <td className='p-4 text-sm'>
                    {order.address.name}
                    <div className='text-xs text-gray-500'>{order.address.phone}</div>
                  </td>
                  <td className='p-4 text-sm'>{order.productMerchant.shopName}</td>
                  <td className='p-4 text-sm'>
                    {order.products.map((p: any, i: number) => (
                      <div key={i}>
                        {p.product?.title} X {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className='p-4 text-sm'>{order.totalAmount}</td>
                  <td className='p-4 text-sm'>
                    {order.paymentMethod.toUpperCase()}
                    <div className={`text-xs font-medium ${order.isPaid ? 'text-[#00684D]' : 'text-yellow-600'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                  </td>
                  <td className='p-4 text-sm'>
                    <span className={`font-semibold capitalize ${statusStyles[order.orderStatus] || 'text-gray-600'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className='p-4 text-sm'>
                    {formateDate(String(order.createdAt))}
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
                <span className='text-sm'>#{String(order._id)!.slice(-8)}</span>
                <span className='text-[#00684D] font-bold'>৳{order.totalAmount}</span>
              </div>

              <p className='text-sm'>
                <b>Buyer: </b>{order.address?.name}
              </p>
              <p className='text-sm'>
                <b>Merchant: </b>{order.productMerchant.shopName}
              </p>
              <p className='text-xs text-gray-500'>
                {order.address?.phone}
              </p>
              <div className='text-sm text-gray-700'>
                {order.products.map((p: any, i: number) => (
                  <p key={i}>
                    {p.product?.title} X {p.quantity}
                  </p>
                ))}
              </div>

              <div className='mt-3 text-sm'>
                <b>Status:</b>{" "}
                <span className={`font-semibold capitalize ${statusStyles[order.orderStatus] || 'text-gray-600'}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className='mt-1.5 text-sm text-gray-600'>
                {formateDate(String(order.createdAt))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {orders.length > itemsPerPage && (
        <div className='flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 mt-6 pt-4 gap-4'>
          <p className='text-xs sm:text-sm text-gray-500'>
            Showing <span className='font-medium text-gray-900'>{indexOfFirstItem + 1}</span> to{' '}
            <span className='font-medium text-gray-900'>{Math.min(indexOfLastItem, orders.length)}</span> of{' '}
            <span className='font-medium text-gray-900'>{orders.length}</span> orders
          </p>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='px-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
            >
              Previous
            </button>

            <div className='flex items-center gap-1'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition ${
                    currentPage === page
                      ? 'bg-[#00684D] text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

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
    </div>
  )
}

export default UserOrders