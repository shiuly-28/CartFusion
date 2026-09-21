/* eslint-disable @typescript-eslint/no-explicit-any */
import UseGetAllMerchant from '@/hooks/UseGetAllMerchant';
import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData';
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser';
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
  UserGetCurrentUser

  const {allProductData} = useSelector((state:RootState)=>state.merchant)
  const {allOrdersData} = useSelector((state:RootState)=>state.user)
  const {userData} = useSelector((state:RootState)=>state.user)

  const merchantOrders = allOrdersData.filter(
    (o: any)=>
      String(o.productMerchant?._id || o.productMerchant) ===
    String(userData?._id)
  );

  const merchantProducts = allProductData.filter(
    (p:any)=>
      String(p.merchant?._id || p.merchant) === String(userData?._id)
  );

  const validOrders = merchantOrders.filter(
    (o:any)=>
      o.orderStatus !== "cancelled" &&
      o.orderStatus !== "returned"
  );

  let totalSales = 0;
  const customers = new Set<string>();
  validOrders.forEach((o: any) =>{
    totalSales += o.totalAmount;
    customers.add(String(o.buyer?._id || o.buyer));
  })

   const deliveredOrders = merchantOrders.filter(
      (o: any) => o.orderStatus === "delivered"
    );
   const cancelledOrders = merchantOrders.filter(
      (o: any) => o.orderStatus === "cancelled"
    );
    const returnOrders = merchantOrders.filter(
      (o: any) => o.orderStatus === "returned"
    );
    const remainingOrders = merchantOrders.filter(
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

    const ordersDateMap: Record<string, number> = {};
    validOrders.forEach((o:any)=> {
      const d = new Date(o.createAt).toLocaleDateString("en-IN");
      ordersDateMap[d] = (ordersDateMap[d] || 0) + 1;
    });
    const ordersByDate = Object.keys(ordersDateMap).map((d) => ({
      date: d,
      orders:ordersDateMap[d],
    }));

    const productSalesMap: Record<string, number> = {};
    validOrders.forEach((o: any) =>
    o.products.forEach((p: any) => {
      const t = p.product?.title || "Unknown";
      productSalesMap[t] = (productSalesMap[t] || 0) + p.quantity;
    })
  );

    const productSales = Object.keys(productSalesMap).map((t)=> ({
      product: t.length > 12 ? t.slice(0, 12) + "..." : t,
      sold: productSalesMap[t],
    })
  );


  return (
    <div className='min-h-screen w-full px-4 sm:px-6 py-6 text-white'>
      <div className='max-w-full mx-auto space-y-8'>

      <div className='bg-white/5 border/10 border rounded-xl p-5'>
        <h1 className='text-xl sm:text-2xl font-bold'>{userData?.shopName}</h1>
        <p className='text-xs sm:text-sm text-gray-400 break-all'>{userData?.email}</p>
      </div>

        <div className='grid grid-cols-2 sm:grid-cols-4  gap-3'>
          <Statbox title="Customers" value={customers.size}/>
          <Statbox title="Products" value={merchantProducts.length}/>
          <Statbox title="Orders" value={validOrders.length}/>
          <Statbox title="Sales" value={`৳ ${totalSales}`}/>
        </div>

      
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Bar graph */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 h-[280px] sm:h-[350px]'>
          <h2 className='font-semibold mb-2 text-sm'>Order by Date</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersByDate}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis 
              dataKey="date"
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

        <div></div>
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
