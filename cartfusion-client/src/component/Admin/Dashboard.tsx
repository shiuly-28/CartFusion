/* eslint-disable @typescript-eslint/no-explicit-any */
import UseGetAllMerchant from '@/hooks/UseGetAllMerchant';
import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData';
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import { IUser } from '@/model/user.model';
import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';

interface StatboxProps {
  title: string;
  value: React.ReactNode;
}

function AdminDashboard() {
  UseGetAllOrdersData()
  UseGetAllProducts()
  UseGetAllMerchant()

  const {AllMerchantData, allProductData} = useSelector((state:RootState)=>state.merchant)
  const {allOrdersData} = useSelector((state:RootState)=>state.user)

   const merchant = AllMerchantData || []
    const pendingMerchant = AllMerchantData.filter((v)=> v.verificationStatus === "pending")
   const products = allProductData || []

    const pendingProducts = allProductData.filter((p)=> p.verificationStatus === "pending")

    const orders = allOrdersData|| []

    const deliveredOrders = allOrdersData.filter((o)=>o.orderStatus === "delivered")

    let totalEarning = 0
    deliveredOrders.forEach((o)=>{
      if(o.isPaid){
        totalEarning += o.totalAmount
      }
    })
 
  return (
    <div className='min-h-screen w-full px-4 sm:px-6 py-6 text-white'>
      <div className='max-w-full mx-auto space-y-8'>
        <h1 className='text-xl sm:text-2xl font-bold'>Admin Dashboard</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
          <Statbox title="Total Merchant" value={merchant.length}/>
          <Statbox title="Pending Merchant" value={pendingMerchant.length}/>
          <Statbox title="Total Products" value={products.length} />
          <Statbox title="Pending Products" value={pendingProducts.length}/>
          <Statbox title="Total Orders" value={orders.length} />
          <Statbox title="Total Earnings" value={`৳ ${totalEarning}`} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 '>
          {
            merchant.map((v:IUser,i:number)=>{
              const merchantProducts = allProductData.filter(
                (p:any) =>
                  String(p.merchant?._id || merchant) === String(v._id)
              )
              const merchantOrders = allOrdersData.filter(
                (o:any) =>
                  String(o.productMerchant?._id || o.productMerchant) === String(v._id)
              );
              const cancelled = merchantOrders.filter(
                (o:any) => o.orderStatus === "cancelled"
              ).length;
              const returned = merchantOrders.filter(
                (o:any) => o.orderStatus === "returned"
              ).length;
              let merchantEarning = 0;
              merchantOrders.forEach((o: any)=>{
                if(o.orderStatus === "delivered" && o.isPaid){
                  merchantEarning += o.totalAmount;
                }
              });
              return(
                <div key={i} className='bg-white/5 border border-white/10 rounded-xl p-4'>
                  <h2 className='font-semibold text-base truncate'>{v.shopName}</h2>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

function Statbox({ title, value }: StatboxProps) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
      <p className='text-xs uppercase text-gray-400'>{title}</p>
      <p className='text-lg sm:text-2xl font-bold mt-1'>{value}</p>
    </div>
  );
}