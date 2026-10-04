/* eslint-disable @typescript-eslint/no-explicit-any */
import UseGetAllMerchant from '@/hooks/UseGetAllMerchant';
import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData';
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import UserGetCurrentUser from '@/hooks/UserGetCurrentUser';
import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface StatboxProps {
  title: string;
  value: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

function AdminDashboard() {
  UseGetAllOrdersData();
  UseGetAllProducts();
  UserGetCurrentUser();

  const { allProductData } = useSelector((state: RootState) => state.merchant);
  const { allOrdersData } = useSelector((state: RootState) => state.user);
  const { userData } = useSelector((state: RootState) => state.user);

  const merchantOrders = allOrdersData.filter(
    (o: any) =>
      String(o.productMerchant?._id || o.productMerchant) ===
      String(userData?._id)
  );

  const merchantProducts = allProductData.filter(
    (p: any) =>
      String(p.merchant?._id || p.merchant) === String(userData?._id)
  );

  const validOrders = merchantOrders.filter(
    (o: any) =>
      o.orderStatus !== "cancelled" &&
      o.orderStatus !== "returned"
  );

  let totalSales = 0;
  const customers = new Set<string>();
  validOrders.forEach((o: any) => {
    totalSales += o.totalAmount;
    customers.add(String(o.buyer?._id || o.buyer));
  });

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
    (o: any) =>
      !["delivered", "cancelled", "returned"].includes(o.orderStatus)
  );

  const orderProgress = [
    { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: remainingOrders.length },
    { name: "Cancelled", value: cancelledOrders.length },
    { name: "Returned", value: returnOrders.length },
  ];

  const COLORS = ["#00684D", "#3b82f6", "#ef4444", "#f97316"];

  const ordersDateMap: Record<string, number> = {};
  validOrders.forEach((o: any) => {
    const d = new Date(o.createdAt).toLocaleDateString("en-IN");
    ordersDateMap[d] = (ordersDateMap[d] || 0) + 1;
  });
  const ordersByDate = Object.keys(ordersDateMap).map((d) => ({
    date: d,
    orders: ordersDateMap[d],
  }));

  const productSalesMap: Record<string, number> = {};
  validOrders.forEach((o: any) =>
    o.products.forEach((p: any) => {
      const t = p.product?.title || "Unknown";
      productSalesMap[t] = (productSalesMap[t] || 0) + p.quantity;
    })
  );

  const productSales = Object.keys(productSalesMap).map((t) => ({
    product: t.length > 12 ? t.slice(0, 12) + "..." : t,
    sold: productSalesMap[t],
  }));

  return (
    <div className='min-h-screen w-full px-4 sm:px-6 py-6 bg-slate-50/50 text-gray-900'>
      <div className='max-w-full mx-auto space-y-5'>

        {/* Header Card */}
        <div className='bg-white border border-gray-200 shadow-xs rounded-xl p-5'>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>{userData?.shopName}</h1>
          <p className='text-xs sm:text-sm text-gray-500 break-all'>{userData?.email}</p>
        </div>

        {/* Top Stat Cards with Soft Colors */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          <Statbox 
            title="Customers" 
            value={customers.size} 
            bgColor="bg-indigo-50 border-indigo-100" 
            textColor="text-indigo-600"
          />
          <Statbox 
            title="Products" 
            value={merchantProducts.length} 
            bgColor="bg-blue-50 border-blue-100" 
            textColor="text-blue-600"
          />
          <Statbox 
            title="Orders" 
            value={validOrders.length} 
            bgColor="bg-emerald-50 border-emerald-100" 
            textColor="text-[#00684D]"
          />
          <Statbox 
            title="Sales" 
            value={`৳ ${totalSales}`} 
            bgColor="bg-teal-50 border-teal-100" 
            textColor="text-teal-700"
          />
        </div>

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Bar Chart Card */}
          <div className='bg-white border border-gray-200 shadow-xs rounded-xl p-4 h-[280px] sm:h-[490px]'>
            <h2 className='font-semibold mb-2 text-sm text-gray-900'>Order by Date</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip />
                <Bar dataKey="orders" fill='#00684D' />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart Card */}
          <div className='bg-white border border-gray-200 shadow-xs rounded-xl p-4'>
            <h2 className='font-semibold mb-2 text-sm text-gray-900'>Order Status Distribution</h2>
            <div className='grid grid-cols-2 gap-2 mb-4'>
              <Statusbox 
                label='Delivered' 
                value={deliveredOrders.length} 
                color='text-[#00684D]' 
                bgColor='bg-emerald-50 border-emerald-100'
              />
              <Statusbox 
                label='Pending' 
                value={remainingOrders.length} 
                color='text-blue-600' 
                bgColor='bg-blue-50 border-blue-100'
              />
              <Statusbox 
                label='Cancelled' 
                value={cancelledOrders.length} 
                color='text-red-500' 
                bgColor='bg-red-50 border-red-100'
              />
              <Statusbox 
                label='Returned' 
                value={returnOrders.length} 
                color='text-orange-500' 
                bgColor='bg-orange-50 border-orange-100'
              />
            </div>

            <div className='h-[220px] sm:h-[260px]'>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={orderProgress}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {orderProgress.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Line Chart Card */}
        <div className='bg-white border border-gray-200 shadow-xs rounded-xl p-4 h-[260px] sm:h-[320px]'>
          <h2 className='text-sm font-semibold mb-2 text-gray-900'>Product Sales</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productSales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="product"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
                tick={{ fontSize: 10, fill: '#6b7280' }}
              />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sold"
                stroke='#00684D'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

function Statbox({ 
  title, 
  value, 
  bgColor = "bg-white border-gray-200", 
  textColor = "text-gray-900" 
}: StatboxProps) {
  return (
    <div className={`${bgColor} border rounded-xl p-4 transition-all duration-200`}>
      <p className='text-xs uppercase font-medium text-gray-600'>{title}</p>
      <p className={`text-lg sm:text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
    </div>
  );
}

function Statusbox({
  label,
  value,
  color,
  bgColor,
}: {
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} border rounded-xl p-3 text-center transition-all duration-200`}>
      <p className='text-xs text-gray-600 font-medium'>{label}</p>
      <p className={`text-lg sm:text-xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}