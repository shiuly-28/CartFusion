/* eslint-disable @typescript-eslint/no-explicit-any */
import UseGetAllMerchant from '@/hooks/UseGetAllMerchant';
import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData';
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import { IUser } from '@/model/user.model';
import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


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

    const merchantOrderGraph: {merchant: string; orders:number}[] = [];

    for(let i = 0; i < allOrdersData.length; i++){
      const order = allOrdersData[i]

      let merchantName = order.productMerchant?.shopName || "Unknown";

      if(merchantName.length > 14){
        merchantName = merchantName.slice(0, 14) + "...";
      }
      let found = false;

      for (let j = 0; j < merchantOrderGraph.length; j++){
        if(merchantOrderGraph[j].merchant === merchantName){
          merchantOrderGraph[j].orders = merchantOrderGraph[j].orders + 1;
          found = true;
          break;
        }
      }

      if(!found){
        merchantOrderGraph.push({
          merchant: merchantName,
          orders: 1,
        });
      }
    }

    const cancelledOrders = allOrdersData.filter(
      (o: any) => o.orderStatus === "cancelled"
    );
    const returnOrders = allOrdersData.filter(
      (o: any) => o.orderStatus === "returned"
    );
    const remainingOrders = allOrdersData.filter(
      (o:any)=>
        !["delivered", "cancelled", "returned"].includes(o.orderStatus)
    )

    const orderProgress = [
      {name:"Delivered", value:deliveredOrders.length},
      {name:"Pending", value:remainingOrders.length},
      {name:"Cancelled", value:cancelledOrders.length},
      {name:"Returned", value:returnOrders.length},
    ];

    const COLORS = ["#00684D", "#3b82f6", "#ef4444", "#f97316"];
 
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
              const delivered = merchantOrders.filter(
                (o:any) => o.orderStatus === "delivered"
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
                  <p className='text-xs text-gray-400 mbv-2'>Status: <span className={` capitalize ${
                   v.verificationStatus === "approved"
                    ? "text-[#00684D]"
                  : "text-yellow-400" 
                  }`}>{v.verificationStatus}</span> </p>
                  <div className='text-sm space-y-1'>
                    <p>Products: {merchantProducts.length}</p>
                    <p>Orders: {merchantOrders.length}</p>
                    <p className='text-red-400'>Cancelled: {cancelled}</p>
                    <p className='text-[#00684D]'>Delivered: {delivered}</p>
                    <p className='text-orange-400'>Returned: {returned}</p>
                    <p className='text-[#00684D] font-semibold'>Earning: ৳ {merchantEarning}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gsp-6'>
          {/* Bar graph */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 h-[280px] sm:h-[350px]'>
          <h2 className='font-semibold mb-2 text-sm'>Merchant-wise Orders</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={merchantOrderGraph}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis 
              dataKey="merchant"
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
              tick={{ fontSize: 10 }}/>
              <YAxis tick={{fontSize: 10 }}/>
              <Tooltip/>
              <Bar dataKey="orders" fill='#00684D'/>
            </BarChart>
          </ResponsiveContainer>

          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
          <h2 className='font-semibold mb-2 text-sm'>Order Status Distribution</h2>
          <div className='grid grid-cols-2 gap-2 mb-4'>
           <Statusbox label='Delivered' value={deliveredOrders.length} color='text-[#045f47]'/>
           <Statusbox label='Pending' value={remainingOrders.length} color='text-white'/>
           <Statusbox label='Cancelled' value={cancelledOrders.length} color='text-red-500'/>
           <Statusbox label='Returned' value={returnOrders.length} color='text-yellow-500'/>
          </div >

          <div className='h-[220px] sm:h-[260px]'>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                data={orderProgress}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label>
                  {orderProgress.map((_, i)=>(
                    <Cell key={i} fill={COLORS[i]}/>
                  ))}
              </Pie>
              <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          </div>
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

function Statusbox({
  label,
  value,
  color,
} : {
  label: string;
   value: string | number; 
  color: string;
}){
  return(
    <div className='bg-black/40 border border-white/10 rounded-lg p-3 text-center'>
      <p className='text-xs text-gray-400'>{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}