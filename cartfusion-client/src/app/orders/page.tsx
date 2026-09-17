/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'
import {motion} from 'motion/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


function Orders() {
  UseGetAllOrdersData()
  UserGetCurrentUser()

  const {userData} = useSelector((state:RootState) => state.user)
  const {allOrdersData} = useSelector((state:RootState) => state.user)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [trackOrderModel, setTrackOrderModel] = useState<any | null>(null)

  const orders =Array.isArray(allOrdersData)?
  allOrdersData.filter((o)=>String(o.buyer._id) === String(userData?._id)) : []

  const dispatch = useDispatch<AppDispatch>()

  const [now, setNow] = useState<number>(() => Date.now())   // 👈 initial value সরাসরি useState এ

useEffect(() => {
  const interval = setInterval(() => setNow(Date.now()), 60000)
  return () => clearInterval(interval)
}, [])


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

  const isCanceldDisable = (order:any)=> order.isPaid === true && order.paymentMethod === "stripe"

  const status = ["pending", "confirmed", "shipped", "delivered"]

  const renderTrackStep = (currentStatus:string)=>{
    return(
      <div className='relative pl-6'>
      <div className='absolute top left-8 w-fullw-[1px] h-full  bg-gray-600'></div>
        {status.map((s,i)=>{
          const active = currentStatus === s
          return(
          <div key={i} className='relative mb-6 flex items-start'>
            {/* dot */}
            <div className={`w-4 h-4 rounded-full ${active ?
             "bg-[#00684D] shadow-lg shadow-[#00684D]" : "bg-gray-500"

            }`}></div>
          <div className='ml-4 text-sm'>{s.toUpperCase()}</div>
      </div>
    )
        })}

   
      </div>
    )
  }

  const handleCancel = async (orderId: string) => {
  try {
    await axios.post("/api/order/cancelOrder", { orderId });

    // orderStatus এর পাশাপাশি isPaid কে false করে দিন
    const updatedOrder = allOrdersData.map((o: any) =>
      o._id === orderId
        ? { ...o, orderStatus: "cancelled", isPaid: false }
        : o
    );

    dispatch(setAllOrdersData(updatedOrder));
    alert("Order Cancelled Successfully");
    setSelectedOrder(null);
  } catch (error) {
    console.error(error);
    alert("Order Cancel error");
  }
};

const isEligibleReturn = (deliveryDate: string, replacementDays: number, now: number | null) => {
  if (!deliveryDate || !replacementDays || !now) return false;
  const deliveredAt = new Date(deliveryDate).getTime();
  const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;
  return now <= expiry;
}

const remainingDays = (deliveryDate: string, replacementDays: number, now: number | null) => {
  if (!deliveryDate || !replacementDays || !now) return 0;
  const deliveredAt = new Date(deliveryDate).getTime();
  const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;
  const diff = expiry - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000))
}
const ReturnEndDate = (deliveryDate:string, replacementDays:number)=>{
 if(!deliveryDate || !replacementDays) return null;

 const deliveredAt = new Date(deliveryDate);
 deliveredAt.setDate(deliveredAt.getDate() + replacementDays);

 return deliveredAt;
}

const returnOrder = async (orderId:string) => {
   try {
    const result = await axios.post("/api/order/return", { orderId });
    const updatedOrder = allOrdersData.map((o: any) =>
      o._id === orderId
        ? { ...o, orderStatus: "returned", returnAmount: result.data.returnAmount, isPaid: false }
        : o
    );

    dispatch(setAllOrdersData(updatedOrder));
    alert("Order returned Successfully");
    setSelectedOrder(null);
  } catch (error) {
    console.error(error);
    alert("Order returned error");
  }
}
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black
     to-gray-900 text-white '>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6 font-bold flex items-center justify-between'>
          <div className='mt-5'>
            <h1 className='text-2xl font-bold'>My Orders</h1>
            <p>All orders placed by you</p>
          </div>
          <div className='text-sm text-gray-300'>{orders.length} Orders</div>
        </div>
         {/* lg device */}
    <div className='hidden lg:block bg-white/5 border border-white/10
    rounded-xl overflow-auto shadow-xl shadow-black/40'>
      <table className='w-full text-left'>
        <thead className='text-xs bg-white/5 border border-white/10 text-gray-300 uppercase tracking-wide'>
          <tr>
            <th className='px-4 py-4'>Orders ID</th>
            <th className='px-4 py-4'>Date</th>
            <th className='px-4 py-4'>Products</th>
            <th className='px-4 py-4'>Merchant</th>
            <th className='px-4 py-4'>Payment</th>
            <th className='px-4 py-4'>Status</th>
            <th className='px-4 py-4 text-right'>Total</th>
            <th className='px-4 py-4 text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
  {
    orders.length !== 0 ? (
      orders.map((order, index) => (
        <tr 
          key={index}
          className='border-t border-white/5 hover:bg-white/10 transition-all duration-200'
        >
          <td className='px-4 py-4 text-sm'>#{String(order._id).slice(-8)}</td>
          <td className='px-4 py-4 text-sm'>{formateDate(String(order.createdAt))}</td>
          <td className='px-4 py-4 text-sm'>
            {order.products.map((p, i) => (
              <div key={i} className='text-gray-200'>{p.product.title} * {p.quantity}</div>
            ))}
          </td>
          <td className='px-4 py-4 text-sm'>{order.productMerchant.shopName}</td>
          <td className='px-4 py-4 text-sm'>
            {order.paymentMethod.toUpperCase()}
            <div className={`text-xs ${order.isPaid ? "text-[#00684D]" : "text-amber-400"}`}>
              {order.isPaid ? "paid" : "pending"}
            </div>
          </td>
          <td className='px-4 py-4 text-sm'>{order.orderStatus.toUpperCase()}</td>
          <td className='px-4 py-4 text-right text-[#00684D] font-semibold'>
            <span className='text-2xl'>৳</span>{order.totalAmount}
          </td>
          <td className='px-4 py-4 flex justify-center'>
  <div className='flex gap-2'>

    {order.orderStatus === "cancelled" && (
      <span className='text-red-500 font-semibold'>Cancelled</span>
    )}
    {order.orderStatus === "returned" && (
      <span className='text-orange-500 flex flex-col gap-1
       font-semibold'>Returned<span className='text-white'>Returned Amount: {order.returnAmount}</span></span>
    )}

    {order.orderStatus !== "cancelled" && order.orderStatus !== "returned" && (
      <>
        <button onClick={()=>setSelectedOrder(order)}
          className='px-3 py-1 bg-white/10 rounded hover:bg-white/20 text-nowrap'>
          Check Details
        </button>
        <button disabled={order.orderStatus === "delivered"}
          onClick={()=>setTrackOrderModel(order)}
          className={`px-3 flex py-1 justify-center items-center rounded transition text-nowrap
          ${order.orderStatus === "delivered"
          ? "bg-[#00684D] text-[#39e9ba] cursor-not-allowed"
          :"bg-white/10 hover:bg-white/20"
           }`}>
          {order.orderStatus === "delivered" ? "Delivered" : "Track Order"}
        </button>
      </>
    )}
  </div>
</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={8} className='text-center py-6 text-gray-400'>
          No orders found
        </td>
      </tr>
    )
  }
</tbody>
      </table>

    </div>
    <div className='lg:hidden space-y-4'>
        { orders.length !== 0 ? (
          orders.map((order, index)=>(
            <motion.div
            initial={{scale: 0.95, opacity: 0}}
            animate={{scale: 1, opacity: 1 }}
            transition={{duration: 0.4}}
            key={index} className='bg-white/5 border border-white/10 p-4 rounded-xl'>
              <div className='flex justify-between'>
                <div>
                  <div className='text-sm text-gray-300'>#{String(order._id).slice(-8)}</div>
                  <div className='font-semibold'>{formateDate(String(order.createdAt))}</div>
                  <div className='text-sm text-gray-300 mt-1'>{order.productMerchant.shopName}</div>
                </div>
                <div className='text-[#00684D] font-bold text-right'>
                  <span className='text-2xl'>৳</span>{order.totalAmount}
                </div>
              </div>
              <div>
                <div>
                  <div className='text-sm text-gray-400'>Payment Method: {" "}{order.paymentMethod.toUpperCase()}</div>
                  <div className={`text-xs ${order.isPaid ? "text-[#00684D]" : "text-amber-400"}`}>{order.isPaid ? "paid" : "pending"}</div>
                </div>
                <div className='text-right'>
                  <div className='text-xs text-gray-400'>Status</div>
                  <div className='text-sm font-semibold'>{order.orderStatus.toUpperCase()}</div>
                </div>
              </div>
              <div className='mt-3 space-y-1'>
                 {order.products.map((p, i) => (
              <div key={i} className='text-gray-200 text-sm'>{p.product.title} * {p.quantity}</div>
            ))}
              </div>
              
              {/* gjhjhjhk */}
             {order.orderStatus === "cancelled" && (
                <span className='text-red-500 font-semibold'>Cancelled</span>
              )}
              {order.orderStatus === "returned" && (
                <span className='text-orange-500 flex flex-col gap-1
                 font-semibold'>Returned<span className='text-white'>Returned Amount: {order.returnAmount}</span></span>
              )}

             {order.orderStatus !== "cancelled" && order.orderStatus !== "returned" && (
  <div className='mt-3 flex gap-2'>
    <button
      onClick={()=>setSelectedOrder(order)}
      className='flex-1 py-2 bg-white/10 rounded'>Check Details</button>
    <button disabled={order.orderStatus === "delivered"}
      onClick={()=>setTrackOrderModel(order)}
      className={`px-3 flex py-1 justify-center items-center rounded transition text-nowrap
      ${order.orderStatus === "delivered"
      ? "bg-[#00684D] text-[#39e9ba] cursor-not-allowed"
      :"bg-white/10 hover:bg-white/20"
       }`}>
      {order.orderStatus === "delivered" ? "Delivered" :
      "Track Order"}
    </button>
  </div>
)}   
</motion.div>
       
          ))
        ) : (<motion.div
          initial={{scale: 0.95, opacity: 0}}
          animate={{scale: 1, opacity: 1 }}
          transition={{duration: 0.4}}
          className='text-xl text-center text-white bg-white/5
          border border-white/10 p-4 rounded-xl'>No Orders found</motion.div>)
        }
      </div>
      </div>
   
        {selectedOrder && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <motion.div 
            initial={{scale: 0.95, opacity: 0}}
          animate={{scale: 1, opacity: 1 }}
          transition={{duration: 0.4}}
            className='relative z-0 w-full max-w-3xl bg-[#061526] border border-white/10 p-6 
            rounded-xl shadow-2xl shadow-black/40'>
              <h2 className='text-lg font-semibold'>Order Details: #{String(selectedOrder._id).slice(-8)}</h2>
              <p>{formateDate(String(selectedOrder.createdAt))}</p>
              <hr className='my-4 border-white/10' />
              <h3 className='font-semibold mb-2'>Product</h3>
                   {selectedOrder.products.map((p:any, i:any) => (
              <div key={i} className='flex justify-between bg-white/5 rounded mb-2 p-3'>
               <div>
                <div className='font-medium'>{p.product.title}</div>
                <div>Qty: {p.quantity} * Price: {p.price}</div>
               </div>
               </div>
            ))}
            <hr className='my-4 border-white/10' />
            <h3 className='font-semibold mb-2'>Invoice</h3>
            <div className='text-sm space-y-1'>
              <div className='flex justify-between'>
                <span>Product Total</span>
                <span>{selectedOrder.productsTotal}</span>
              </div>

              <div className='flex justify-between'>
                <span>Delivery Charge</span>
                <span>{selectedOrder.deliveryCharge}</span>
              </div>

              <div className='flex justify-between'>
                <span>Service Charge</span>
                <span>৳ {selectedOrder.serviceCharge ?? 0}</span>
              </div>
            </div>
            <hr className='my-4 border-white/10' />
            <div className='flex justify-between font-semibold text-[#00684D]'>
              <span>Final Total</span>
              <span>৳{selectedOrder.totalAmount}</span>
            </div>

            {selectedOrder.orderStatus === "delivered" && 
            selectedOrder.deliveryDate && (
              <div className='mt-3 text-sm text-[#00684D]'>
                Delivered on:{" "}
                {new Date(selectedOrder.deliveryDate).toLocaleDateString("en-IN")}
              </div>
            )}
            {selectedOrder.isPaid == true && selectedOrder.paymentMethod == "stripe" && 
            <div className='bg-yellow-500/10 border border-yellow-500/30 text-xs rounded-lg p-3 mt-4'>
              <p>Important Note:</p>
              <ul>
                <li>
                  Order cancellation feature is <b>not available if payment is done using Online Payment(Stripe)</b>
                </li>
                <li>You can only <b>return the product</b>after delivery.</li>
                <li>On return, you will recive only the <b>product amount</b></li>
                <li><b>Delivery & service charges are non-refundable</b></li>
              </ul>
            </div> }

            <div className='mt-6 flex justify-end gap-3 '>
              <button 
              onClick={()=>setSelectedOrder(null)}
              className='px-4 py-2 bg-white/10 rounded'>Cancel</button>

              <button disabled={selectedOrder.orderStatus === "delivered"}
              onClick={()=>setTrackOrderModel(selectedOrder)}
              className={`px-3 flex py-1 justify-center items-center rounded transition text-nowrap
              ${selectedOrder.orderStatus === "delivered"
              ? "bg-[#00684D] text-[#39e9ba] cursor-not-allowed"
              :"bg-white/10 hover:bg-white/20"
               }`}>
                {selectedOrder.orderStatus === "delivered" ? "Delivered" :
                "Track Order"}
              </button>

           {selectedOrder.orderStatus !== "delivered" ? (
  <button 
    onClick={()=>handleCancel(selectedOrder._id)}
    disabled={isCanceldDisable(selectedOrder)}
    className={`px-4 py-2 rounded ${isCanceldDisable(selectedOrder)
      ? "bg-white/10 text-gray-400 cursor-not-allowed"
      : "bg-red-600 hover:bg-red-700"
    }`}>
    Cancel Order
  </button>
) : (
  selectedOrder.products.map((p:any, i: number) => {
    const replacementDays = p?.product.replacementDays || 0;
    const eligible = isEligibleReturn(selectedOrder.deliveryDate, replacementDays, now);
const remaining = remainingDays(selectedOrder.deliveryDate, replacementDays, now);
    const returnEndDate = ReturnEndDate(selectedOrder.deliveryDate, replacementDays);
      

    return(
      <div key={i} className='flex md:flex-row flex-col justify-between items-center bg-white/5 px-3 py-2 rounded ml-2'>
        <div>
          <p className='text-xs text-gray-300'>{p.product?.title}</p>
          {eligible ? (
            <>
              <p className='text-xs text-yellow-400'>
                Return available for {remaining} day{remaining > 1 ? "s" : ""}
              </p>
              {returnEndDate && (
                <p className='text-[11px] text-gray-400'>
                  Return till: {returnEndDate.toLocaleDateString("en-IN")}
                </p>
              )}
            </>
          ) : (
            <p className='text-xs text-red-400'>Return window closed</p>
          )}
        </div>
        {eligible && (
          <button
          onClick={()=>returnOrder(selectedOrder._id)}
          className='mx-3 px-3 py-1 bg-yellow-600 rounded text-sm'>
            Return
          </button>
        )}
      </div>
    )
  })
)}
            </div>
            </motion.div>
          </div>
        )}

        {trackOrderModel && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <motion.div
            initial={{scale: 0.95, opacity: 0}}
            animate={{scale: 1, opacity: 1 }}
            transition={{duration: 0.4}}
            className='relative z-10  w-full max-w-md bg-[#061526] border border-white/10 p-6 rounded-xl'>
                <h2 className='text-lg font-semibold'>Track Order</h2>
                <div className='text-sm text-gray-300 mb-4 leading-relaxed'>
                  <span className='text-md font-semibold mb-2'>Delivery Complete Address</span>
                  <div className='flex justify-start gap-2'>
                    <span>Buyer Name: </span>
                    <span>{trackOrderModel.address.name}</span>
                  </div>

                  <div className='flex justify-start gap-2'>
                    <span>Delivery Address: </span>
                    <span>{trackOrderModel.address.address}</span>
                  </div>
                  <div className='flex justify-start gap-2'>
                    <span>City and state: </span>
                    <span>{trackOrderModel.address.city}{" "} & {" "}
                      {trackOrderModel.address.state}
                    </span>
                  </div>
                  <div className='flex justify-start gap-2'>
                    <span>Pincode: </span>
                    <span>{trackOrderModel.address.pincode}</span>
                  </div>
                  <div className='flex justify-start gap-2'>
                    <span>Mobile No: </span>
                    <span>{trackOrderModel.address.phone}</span>
                  </div>
                 
                </div>
                 {renderTrackStep(trackOrderModel.orderStatus)}
                 <button 
              onClick={()=>setTrackOrderModel(null)}
              className='px-4 py-2 bg-white/10 rounded'>Cancel</button>
            </motion.div>
            
          </div>
        )}
    </div>
  )
}

export default Orders;
