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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-rirht">
        لیست کدهای تخفیف
      </h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">کد</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">درصد</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">شروع</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">انقضا</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">سقف مبلغ</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">حداقل مبلغ</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">فعال؟</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.map((disc) => (
                <tr
                  key={disc._id}
                  onClick={() => navigate(`update/${disc._id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{disc.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{disc.percent}٪</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.startTime ? new Date(disc.startTime).toLocaleString("fa-IR") : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.expireTime ? new Date(disc.expireTime).toLocaleString("fa-IR") : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.maxPrice !== undefined ? `${disc.maxPrice.toLocaleString()} تومان` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.minPrice !== undefined ? `${disc.minPrice.toLocaleString()} تومان` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.isActive ? "فعال" : "غیرفعال"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(disc.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t">
          <div className="text-sm">
            نمایش {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} تا{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} از {totalCount}
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm">تعداد در صفحه:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border px-2 py-1 rounded"
            >
              <option value={10}>۱۰</option>
              <option value={20}>۲۰</option>
              <option value={50}>۵۰</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              قبلی
            </button>
            <span className="text-sm">صفحه {currentPage} از {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllDiscountCode;
