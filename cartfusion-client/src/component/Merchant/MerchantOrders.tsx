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

  const {userData} = useSelector((state: RootState)=> state.user)
  const { allOrdersData } = useSelector((state:RootState)=>state.user)

   const orders =Array.isArray(allOrdersData)?
  allOrdersData.filter((o)=>String(o.productMerchant._id) === String(userData?._id)) : []


const statusOptions = ["pending", "confirmed", "shipped", "delivered"];

 const updateStatus = async (orderId:string, status:string) => {
  try{
     await axios.post("/api/order/update-status", {orderId, status})
    dispatch(setAllOrdersData(
      allOrdersData.map((o:any)=>(
        o._id == orderId ? {...o, orderStatus:status}: o
      ))
    ))
    alert("Order Status Updated")
  }catch(error){
    console.log(error)
  }
 }


 
   const verifyOtp = async () =>{
    try{
      await axios.post("/api/order/verify-delivery-otp", {
        orderId:otpModel._id,
        otp:otp
      })
       dispatch(setAllOrdersData(
      allOrdersData.map((o:any)=>(
        o._id == otpModel._id ? {...o, orderStatus:"delivered"}: o
      ))
    ))
    alert("Order delivered succesfully")

    }catch(error){
      console.log(error)
      alert("order Delivered error")
    }
   } 

  return (
      <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
        <div className='flex justify-between'>
          <h1 className='tex-xl sm:text-xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-white'>Merchant Order</h1>
        <p className='text-gray-300'>{orders.length} Orders</p>
        </div>
      {/* desktop table */}
      <div className='hidden md:block overflow-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
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
              <td colSpan={5} className='p-6 text-center text-gray-400'>
                No Merchant Approval requests found
              </td>
              </tr>
            ) : (
            orders.map((order, index) => (
              <tr key={index} className='border-t border-white/10 hover:bg-white/5'>
                <td className='p-4'>#{String(order._id)!.slice(-8)}</td>
                <td className='p-4'>#{order.address.name}
                  <div className='text-xs text-gray-400'>{order.address.phone}</div>
                </td>
                <td className='p-4'>
                  {order.products.map((p: any, i: number) =>(
                    <div key={i}>
                      {p.product?.title} X {p.quantity}
                    </div>
                  ))}
                
                </td>
                  <td className='p-4'>#{order.paymentMethod.toUpperCase()}
                  <div className='text-xs text-gray-400'>{order.isPaid? "Paid" : "Pending"}</div>
                </td>
                <td className='p-4'>{order.orderStatus.toUpperCase()}</td>
                <td className='p-4'>
                  <select onChange={async (e)=>{
                  if(e.target.value === "delivered"){
                    updateStatus(String(order._id),"delivered")
                    setOtpModel(order)
                  }else{
                  updateStatus(String(order._id), e.target.value)}}}

                value={order.orderStatus} className='bg-white/10 border border-white/20 w-full rounded px-2 py-1'>
                {statusOptions.map((s,i)=>(
                  <option key={i} value={s} className='bg-black '>{s}</option>
                ))}
                </select></td>
              </tr>
             ))
            )}
          </tbody>
        </table>
      </div>
      {/* mobile card */}
      <div className='md:hidden flex flex-col gap-4'>
            {orders.length === 0 ?(
              <div className='text-center text-gray-400 mt-10'>
                No order found
              </div>
            ) : (
            orders.map((order, index) => (
               <div key={index} className='bg-white/10 border border-white/20 rounded-xl p-4 space-y-2'>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm'>#{String(order._id)!.slice(-8)}</span>
                  <span className='text-[#00684D] font-bold'>৳{order.totalAmount}</span>
                </div>

                <p className='text-sm'>
                  <b>Buyer: </b>{order.address?.name}
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
                 
                 <select 
                  onChange={async (e)=>{
                  if(e.target.value === "delivered"){
                    updateStatus(String(order._id),"delivered")
                    setOtpModel(order)
                  }else{
                  updateStatus(String(order._id), e.target.value)}}}

                 value={order.orderStatus} className='bg-white/10 border border-white/20 w-full rounded px-2 py-1'>
                {statusOptions.map((s,i)=>(
                  <option key={i} value={s} className='bg-black'>{s}</option>
                ))}
                </select>
               </div>
             ))
            )}
      </div>

      {otpModel && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50'>
          <div className='bg-[#061526] p-6 rounded-xl w-full max-w-md'>
            <h2 className='text-lg font-semibold mb-3'>Enter Delivery Otp</h2>
            <input type="text" className='w-full bg-white/10 border border-white/20 px-4 py-2 rounded mb-4'
            onChange={(e)=>setOtp(e.target.value)} value={otp} placeholder='Enter Otp'/>
            <button 
            onClick={verifyOtp}
            className='w-full bg-[#00684D] py-2 rounded flex items-center justify-center gap-2'>Verify & Deliver</button>
          </div>
        </div>
      )}
      </div>
     


   
  )
}

export default MerchantOrders;
