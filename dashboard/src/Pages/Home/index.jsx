
import React, { useEffect, useState } from 'react';
import { Users, UserCheck, MessageCircle, Star, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { useSelector } from 'react-redux';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({});
  const { token } = useSelector((state) => state.auth);

  const fetchData = async () => {
    const headers = { authorization: `Bearer ${token}` };
    const endpoints = {
      totalUsers: 'report/users/total',
      newActive: 'report/users/new-vs-active',
      salesByCategory: 'report/products/sales-by-category',
      statusCounts: 'report/orders/status-counts',
      revenueSummary: 'report/orders/revenue-summary',
      abandonedRate: 'report/carts/abandoned-rate',
      commentsStats: 'report/interactions/comments-stats',
      ratingsStats: 'report/interactions/ratings-stats',
      discountPerf: 'report/marketing/discount-performance',
      shippingRegion: 'report/logistics/shipping-by-region',
      dataGrowth: 'report/system/data-growth'
    };

    try {
      const results = await Promise.all(
        Object.entries(endpoints).map(async ([key, url]) => {
          const res = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, { headers });
          const json = await res.json();
          return [key, json.data];
        })
      );
      const dataMap = Object.fromEntries(results);
      setStats({
        totalUsers: dataMap.totalUsers.total,
        newUsers: dataMap.newActive.newUsers,
        activeUsers: dataMap.newActive.activeUsers,
        gross: dataMap.revenueSummary.gross,
        net: dataMap.revenueSummary.net,
        abandonedRate: Number(dataMap.abandonedRate.rate).toFixed(1),
        totalComments: dataMap.commentsStats.total,
        approvedComments: dataMap.commentsStats.approved,
        avgRating: Number(dataMap.ratingsStats.avgRate).toFixed(2),
        totalRatings: dataMap.ratingsStats.totalCount
      });
      setCharts({
        salesByCategory: dataMap.salesByCategory,
        statusCounts: dataMap.statusCounts,
        discountPerf: dataMap.discountPerf,
        shippingRegion: dataMap.shippingRegion,
        dataGrowth: dataMap.dataGrowth
      });
    } catch (err) {
      console.error('خطا در دریافت اطلاعات داشبورد', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // کارت‌های خلاصه اطلاعات
  const summaryCards = [
    { icon: Users, metric: stats.totalUsers, label: 'کاربران کل', bg: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { icon: UserCheck, metric: stats.newUsers, label: 'کاربران جدید', bg: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { icon: Users, metric: stats.activeUsers, label: 'کاربران فعال', bg: 'bg-gradient-to-r from-green-400 to-green-600' },
    { icon: ShoppingCart, metric: `${stats.abandonedRate}%`, label: 'سبدهای رها شده', bg: 'bg-gradient-to-r from-teal-400 to-teal-600' },
    { icon: DollarSign, metric: `${stats.gross?.toLocaleString()} تومان`, label: 'درآمد ناخالص', bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
    { icon: Activity, metric: `${stats.net?.toLocaleString()} تومان`, label: 'درآمد خالص', bg: 'bg-gradient-to-r from-red-400 to-red-600' },
    { icon: MessageCircle, metric: stats.totalComments, label: 'تعداد نظرات', bg: 'bg-gradient-to-r from-purple-400 to-purple-600' },
    { icon: UserCheck, metric: stats.approvedComments, label: 'نظرات تایید شده', bg: 'bg-gradient-to-r from-pink-400 to-pink-600' },
    { icon: Star, metric: stats.avgRating, label: 'میانگین امتیاز', bg: 'bg-gradient-to-r from-orange-400 to-orange-600' },
    { icon: Star, metric: stats.totalRatings, label: 'تعداد امتیازات', bg: 'bg-gradient-to-r from-yellow-600 to-yellow-800' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-12" style={{ direction: 'rtl' }}>
      <h1 className="text-3xl font-extrabold text-gray-900">داشبورد مدیریت</h1>

      {/* کارت‌های آماری */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {summaryCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              className={`${item.bg} text-white rounded-xl shadow-lg p-4 flex items-center gap-4`}
              variants={cardVariants}
            >
              <Icon className="w-6 h-6" />
              <div>
                <p className="text-2xl font-bold">{item.metric || '۰'}</p>
                <p className="text-sm">{item.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* نمودارها */}
      <div className="space-y-8">
        {/* ردیف اول نمودارها */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* فروش بر اساس دسته‌بندی */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">فروش بر اساس دسته‌بندی</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.salesByCategory} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), value === 'totalRevenue' ? 'درآمد' : 'تعداد']}
                  labelFormatter={(label) => `دسته‌بندی: ${label}`}
                />
                <Legend />
                <Bar dataKey="totalRevenue" name="درآمد (تومان)" fill={COLORS[0]} />
                <Bar dataKey="totalQuantity" name="تعداد فروش" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* وضعیت سفارشات */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">توزیع وضعیت سفارشات</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={charts.statusCounts} 
                  dataKey="count" 
                  nameKey="_id" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {charts.statusCounts?.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'تعداد']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ردیف دوم نمودارها */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* استفاده از کد تخفیف */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">کاربرد کدهای تخفیف</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.discountPerf}>  
                <XAxis dataKey="code" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'تعداد استفاده']}
                  labelFormatter={(label) => `کد: ${label}`}
                />
                <Bar dataKey="uses" name="تعداد استفاده" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ارسال بر اساس منطقه */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">توزیع سفارشات بر اساس شهر</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.shippingRegion}>  
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'تعداد سفارش']}
                  labelFormatter={(label) => `شهر: ${label}`}
                />
                <Bar dataKey="count" name="تعداد سفارش" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* رشد داده‌ها */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">بررسی رشد داده‌ها</h2>
            <ul className="space-y-3">
              {charts.dataGrowth && Object.entries(charts.dataGrowth).map(([key, val]) => (
                <li key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">
                    {key === 'users' && 'کاربران'}
                    {key === 'products' && 'محصولات'}
                    {key === 'orders' && 'سفارشات'}
                    {key === 'comments' && 'نظرات'}
                  </span>
                  <span className="font-medium">{val?.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}