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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2 text-right">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-right">لیست اسلایدرها</h1>

      {sliders.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">هیچ اسلایدری یافت نشد.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تصویر</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آدرس</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ایجاد</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sliders.map((slider) => (
                  <tr
                    key={slider._id}
                    onClick={() => navigate(`update/${slider._id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {slider.image && (
                        <img
                          src={import.meta.env.VITE_BASE_FILE + slider.image}
                          alt={slider.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {slider.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {slider.href}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {new Date(slider.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* صفحه‌بندی */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                قبلی
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                بعدی
              </button>
            </div>

            <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-700">
                  نمایش <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> تا{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> از{" "}
                  <span className="font-medium">{totalCount}</span> مورد
                </p>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value={10}>10 مورد در صفحه</option>
                  <option value={20}>20 مورد در صفحه</option>
                  <option value={50}>50 مورد در صفحه</option>
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  قبلی
                </button>
                <span className="text-sm text-gray-700">
                  صفحه {currentPage} از {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
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
