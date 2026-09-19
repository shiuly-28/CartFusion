/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

function UserOrders() {
 UseGetAllOrdersData()
 const {allOrdersData} = useSelector((state: RootState)=> state.user)

  const formateDate = (date:string)=> {
    if(!date)return;
    const d = new Date(date)
    return d.toLocaleString("en-IN",{
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  }
 
return (
      <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
        <div className='flex justify-between'>
          <h1 className='tex-xl sm:text-xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-white'>Merchant Order</h1>
        <p className='text-gray-300'>{allOrdersData.length} Orders</p>
        </div>
      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
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
            {allOrdersData.length === 0 ? (
              <tr>
              <td colSpan={5} className='p-6 text-center text-gray-400'>
                No Merchant Approval requests found
              </td>
              </tr>
            ) : (
            allOrdersData.map((order, index) => (
              <tr key={index} className='border-t border-white/10 hover:bg-white/5'>
                <td className='p-4 text-sm'>#{String(order._id)!.slice(-8)}</td>
                <td className='p-4 text-sm'>{order.address.name}
                  <div className='text-xs text-gray-400'>{order.address.phone}</div>
                </td>
                <td className='p-4 text-sm'>{order.productMerchant.shopName}</td>
                <td className='p-4 text-sm'>
                  {order.products.map((p: any, i: number) =>(
                    <div key={i}>
                      {p.product?.title} X {p.quantity}
                    </div>
                  ))}
                
                </td>
                <td className='p-4 text-sm'>{order.totalAmount}</td>
                  <td className='p-4 text-sm'>{order.paymentMethod.toUpperCase()}
                  <div className={`text-xs ${order.isPaid ? 'text-yellow-400' : 'text-white'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                </td>
                
                <td className='p-4 text-sm'>

                  {order.orderStatus === "cancelled" && (
                    <span className='text-red-500 font-semibold capitalize'
                    >Cancelled</span>
                  )}
                  {order.orderStatus === "pending" && (
                    <span className='text-red-500 font-semibold capitalize'
                    >Cancelled</span>
                  )}
                  {order.orderStatus === "confirmed" && (
                    <span className='text-pink-300 font-semibold capitalize'
                    >Confirmed</span>
                  )}
                  {order.orderStatus === "shipped" && (
                    <span className='text-indigo-300 font-semibold capitalize'
                    >Shipped</span>
                  )}
                  {order.orderStatus === "delivered" && (
                    <span className='text-[#00684D] font-semibold capitalize'
                    >delivered</span>
                  )}
                  {order.orderStatus === "returned" && (
                    <span className='text-orange-500 font-semibold capitalize'
                    >Returned</span>
                  )}
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
            {allOrdersData.length === 0 ?(
              <div className='text-center text-gray-400 mt-10'>
                No order found
              </div>
            ) : (
           allOrdersData.map((order, index) => (
               <div key={index} className='bg-white/10 border border-white/20 rounded-xl p-4 space-y-2'>
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
                <p className='text-xs text-gray-400'>
                  {order.address?.phone}
                </p>
                <div>
                  {order.products.map((p: any, i: number) =>(
                    <p key={i}>
                      {p.product?.title} X {p.quantity}
                    </p>
                  ))}
                </div>

                <div className='mt-3 text-sm'>
                  <b>Status:</b>{" "}
                  <span className='capitalize'>{order.orderStatus}</span>
                </div>

                 {order.orderStatus === "cancelled" && (
                    <span className='text-red-500 font-semibold capitalize'
                    >Cancelled</span>
                  )}
                  {order.orderStatus === "delivered" && (
                    <span className='text-[#00684D] font-semibold capitalize'
                    >delivered</span>
                  )}
                  {order.orderStatus === "returned" && (
                    <span className='text-orange-500 font-semibold capitalize'
                    >Returned</span>
                  )}

                    {order.orderStatus === "confirmed" && (
                    <span className='text-pink-300 font-semibold capitalize'
                    >Confirmed</span>
                  )}
                  {order.orderStatus === "shipped" && (
                    <span className='text-indigo-300 font-semibold capitalize'
                    >Shipped</span>
                  )}
                 <div className='mt-1.5 text-sm'>{formateDate(String(order.cancelledAt))}</div>
               
               </div>
             ))
            )}
      </div>

   
      </div>
     


   
  )
}

export default UserOrders;
