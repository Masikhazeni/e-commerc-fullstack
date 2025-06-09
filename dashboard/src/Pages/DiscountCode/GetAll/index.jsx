// import React, { useState, useEffect } from "react";
// import fetchData from "../../../Utils/fetchData";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const GetAllDiscountCode = () => {
//   const [discounts, setDiscounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const { token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDiscounts = async () => {
//       try {
//         const response = await fetchData(
//           `discount?page=${currentPage}&limit=${itemsPerPage}`,
//           {
//             method: "GET",
//             headers: { authorization: `Bearer ${token}` },
//           }
//         );
//         if (response.success) {
//           setDiscounts(response.data);
//           setTotalCount(response.count);
//         } else {
//           setError(response.message);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDiscounts();
//   }, [currentPage, itemsPerPage, token]);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2 text-center">
//         خطا در دریافت اطلاعات: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-6" style={{ direction: "rtl" }}>
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">لیست کدهای تخفیف</h1>

//       {/* نمایش موبایل (کارت‌ها) */}
//       <div className="block lg:hidden space-y-4">
//         {discounts.map((disc) => (
//           <div
//             key={disc._id}
//             onClick={() => navigate(`update/${disc._id}`)}
//             className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
//           >
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">کد تخفیف:</p>
//                 <p className="font-medium">{disc.code}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">درصد:</p>
//                 <p>{disc.percent}٪</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">شروع:</p>
//                 <p>{disc.startTime ? new Date(disc.startTime).toLocaleString("fa-IR") : "-"}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">انقضا:</p>
//                 <p>{disc.expireTime ? new Date(disc.expireTime).toLocaleString("fa-IR") : "-"}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">سقف مبلغ:</p>
//                 <p>{disc.maxPrice !== undefined ? `${disc.maxPrice.toLocaleString()} تومان` : "-"}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">حداقل مبلغ:</p>
//                 <p>{disc.minPrice !== undefined ? `${disc.minPrice.toLocaleString()} تومان` : "-"}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">وضعیت:</p>
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   disc.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                 }`}>
//                   {disc.isActive ? "فعال" : "غیرفعال"}
//                 </span>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">تاریخ ایجاد:</p>
//                 <p>{new Date(disc.createdAt).toLocaleDateString("fa-IR")}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* نمایش دسکتاپ (جدول) */}
//       <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">کد</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">درصد</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">شروع</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">انقضا</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">سقف مبلغ</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">حداقل مبلغ</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
//                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ ایجاد</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {discounts.map((disc) => (
//                 <tr
//                   key={disc._id}
//                   onClick={() => navigate(`update/${disc._id}`)}
//                   className="hover:bg-gray-50 cursor-pointer"
//                 >
//                   <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {disc.code}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {disc.percent}٪
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {disc.startTime ? new Date(disc.startTime).toLocaleString("fa-IR") : "-"}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {disc.expireTime ? new Date(disc.expireTime).toLocaleString("fa-IR") : "-"}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {disc.maxPrice !== undefined ? `${disc.maxPrice.toLocaleString()} تومان` : "-"}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {disc.minPrice !== undefined ? `${disc.minPrice.toLocaleString()} تومان` : "-"}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       disc.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                     }`}>
//                       {disc.isActive ? "فعال" : "غیرفعال"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(disc.createdAt).toLocaleDateString("fa-IR")}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t">
//           <div className="flex items-center gap-2">
//             <select
//               value={itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//               <option value={10}>10 مورد در صفحه</option>
//               <option value={20}>20 مورد در صفحه</option>
//               <option value={50}>50 مورد در صفحه</option>
//             </select>
//             <p className="text-sm text-gray-700">
//               نمایش <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> تا{" "}
//               <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> از{" "}
//               <span className="font-medium">{totalCount}</span> نتیجه
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               قبلی
//             </button>
//             <span className="text-sm text-gray-700">
//               صفحه {currentPage} از {totalPages}
//             </span>
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               بعدی
//             </button>
//           </div>
//         </div>
//       </div>

//       {discounts.length === 0 && !loading && (
//         <div className="text-center py-8 text-gray-500">کد تخفیفی یافت نشد</div>
//       )}
//     </div>
//   );
// };

// export default GetAllDiscountCode;


import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllDiscountCode = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetchData(
          `discount?page=${currentPage}&limit=${itemsPerPage}`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }
        );
        if (response.success) {
          setDiscounts(response.data);
          setTotalCount(response.count);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [currentPage, itemsPerPage, token]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2 text-center">
        خطا در دریافت اطلاعات: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6" style={{ direction: "rtl" }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لیست کدهای تخفیف</h1>

      {/* نمایش موبایل (کارت‌ها) */}
      <div className="block lg:hidden space-y-4">
        {discounts.map((disc) => (
          <div
            key={disc._id}
            onClick={() => navigate(`update/${disc._id}`)}
            className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">کد تخفیف:</p>
                <p className="font-medium">{disc.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">درصد:</p>
                <p>{disc.percent}٪</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">شروع:</p>
                <p>{disc.startTime ? new Date(disc.startTime).toLocaleString("fa-IR") : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">انقضا:</p>
                <p>{disc.expireTime ? new Date(disc.expireTime).toLocaleString("fa-IR") : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">سقف مبلغ:</p>
                <p>{disc.maxPrice !== undefined ? `${disc.maxPrice.toLocaleString()} تومان` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">حداقل مبلغ:</p>
                <p>{disc.minPrice !== undefined ? `${disc.minPrice.toLocaleString()} تومان` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">وضعیت:</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  disc.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {disc.isActive ? "فعال" : "غیرفعال"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاریخ ایجاد:</p>
                <p>{new Date(disc.createdAt).toLocaleDateString("fa-IR")}</p>
              </div>
            </div>
          </div>
        ))}

        {/* صفحه‌بندی موبایل */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              قبلی
            </button>
            <span className="text-sm text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              بعدی
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10 مورد در صفحه</option>
              <option value={20}>20 مورد در صفحه</option>
              <option value={50}>50 مورد در صفحه</option>
            </select>
            <p className="text-sm text-gray-700">
              نمایش {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} از {totalCount}
            </p>
          </div>
        </div>
      </div>

      {/* نمایش دسکتاپ (جدول) */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">کد</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">درصد</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">شروع</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">انقضا</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">سقف مبلغ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">حداقل مبلغ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.map((disc) => (
                <tr
                  key={disc._id}
                  onClick={() => navigate(`update/${disc._id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {disc.code}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disc.percent}٪
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disc.startTime ? new Date(disc.startTime).toLocaleString("fa-IR") : "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disc.expireTime ? new Date(disc.expireTime).toLocaleString("fa-IR") : "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disc.maxPrice !== undefined ? `${disc.maxPrice.toLocaleString()} تومان` : "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disc.minPrice !== undefined ? `${disc.minPrice.toLocaleString()} تومان` : "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      disc.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {disc.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(disc.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination دسکتاپ */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t">
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10 مورد در صفحه</option>
              <option value={20}>20 مورد در صفحه</option>
              <option value={50}>50 مورد در صفحه</option>
            </select>
            <p className="text-sm text-gray-700">
              نمایش <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> تا{" "}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> از{" "}
              <span className="font-medium">{totalCount}</span> نتیجه
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              قبلی
            </button>
            <span className="text-sm text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>

      {discounts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">کد تخفیفی یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllDiscountCode;
