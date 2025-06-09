import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchData from "../../../Utils/fetchData";

const GetAllSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSliders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchData(`slider?page=${currentPage}&limit=${itemsPerPage}`);
        if (response.success) {
          setSliders(response.data);
          setTotalCount(response.count);
        } else {
          setError(response.message || "خطا در دریافت داده‌ها");
        }
      } catch (err) {
        setError(err.message || "مشکلی پیش آمده است");
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2 w-full text-right">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-right">لیست اسلایدرها</h1>

      {sliders.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">هیچ اسلایدری یافت نشد.</div>
      ) : (
        <div className="w-full bg-white rounded-lg shadow overflow-hidden">
          {/* Mobile View - Card Layout */}
          <div className="sm:hidden space-y-4 p-4">
            {sliders.map((slider) => (
              <div 
                key={slider._id}
                onClick={() => navigate(`update/${slider._id}`)}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {slider.image && (
                    <img
                      src={import.meta.env.VITE_BASE_FILE + slider.image}
                      alt={slider.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-right">{slider.title}</h3>
                    <p className="text-sm text-gray-500 text-right mt-1 truncate">{slider.href}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500 text-right">
                  {new Date(slider.createdAt).toLocaleDateString("fa-IR")}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table Layout */}
          <div className="hidden sm:block w-full overflow-x-auto">
            <table className="w-full text-right divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase">تصویر</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase">نام</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase">آدرس</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase">تاریخ ایجاد</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sliders.map((slider) => (
                  <tr
                    key={slider._id}
                    onClick={() => navigate(`update/${slider._id}`)}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                      {slider.image && (
                        <img
                          src={import.meta.env.VITE_BASE_FILE + slider.image}
                          alt={slider.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                      {slider.title}
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                      {slider.href}
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                      {new Date(slider.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              نمایش{" "}
              <span className="font-semibold mx-1">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>
              تا{" "}
              <span className="font-semibold mx-1">
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </span>
              از <span className="font-semibold mx-1">{totalCount}</span> نتیجه
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <label className="text-sm text-gray-700">تعداد در صفحه:</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex gap-2 items-center justify-center w-full sm:w-auto">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 sm:px-4 sm:py-2 border text-sm rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  قبلی
                </button>
                <span className="text-sm text-gray-700">
                  صفحه {currentPage} از {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 sm:px-4 sm:py-2 border text-sm rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllSliders;
