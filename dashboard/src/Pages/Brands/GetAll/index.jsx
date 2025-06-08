import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";

const GetAllBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetchData(`brand?page=${currentPage}&limit=${itemsPerPage}`);
        if (response.success) {
          setBrands(response.data);
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

    fetchBrands();
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
    <div className="container mx-auto px-4 py-6" style={{ direction: "rtl" }}>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">لیست برندها</h1>

      {/* نمایش موبایل (کارت‌ها) */}
      <div className="block lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {brands.map((brand) => (
          <div
            key={brand._id}
            onClick={() => navigate(`update/${brand._id}`)}
            className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {brand.image && (
                <img
                  src={import.meta.env.VITE_BASE_FILE + brand.image}
                  alt={brand.name}
                  className="w-16 h-16 object-contain rounded"
                />
              )}
              <div>
                <h3 className="font-medium text-gray-800">{brand.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(brand.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نمایش دسکتاپ (جدول) */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تصویر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr
                  key={brand._id}
                  onClick={() => navigate(`update/${brand._id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {brand.image && (
                      <img
                        src={import.meta.env.VITE_BASE_FILE + brand.image}
                        alt={brand.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {brand.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(brand.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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

      {brands.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">برندی یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllBrands;