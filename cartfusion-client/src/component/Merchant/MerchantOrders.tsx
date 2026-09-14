"use client"


import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'


function MerchantOrders() {
 
  UserGetCurrentUser()
  UseGetAllOrdersData()

  const {userData} = useSelector((state: RootState)=> state.user)
  const { allOrdersData } = useSelector((state:RootState)=>state.user)

   const orders =Array.isArray(allOrdersData)?
  allOrdersData.filter((o)=>String(o.productMerchant._id) === String(userData?._id)) : []


const statusOptions = ["pending", "confirmed", "shipped", "deliverd"];

 

    

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
                <td className='p-4'><select value={order.orderStatus} className='bg-white/10 border border-white/20 w-full rounded px-2 py-1'>
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
                 
                 <select value={order.orderStatus} className='bg-white/10 border border-white/20 w-full rounded px-2 py-1'>
                {statusOptions.map((s,i)=>(
                  <option key={i} value={s} className='bg-black'>{s}</option>
                ))}
                </select>
               </div>
             ))
            )}
      </div>
      </div>
     


   
  )
}

export default MerchantOrders;
