import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchData(
          `product?page=${currentPage}&limit=${itemsPerPage}&populate=categoryId,brandId`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }
        );
        if (response.success) {
          setProducts(response.data);
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

    fetchProducts();
  }, [currentPage, itemsPerPage, token]);

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
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2 w-full">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">همه محصولات</h1>

      <div className="w-full bg-white rounded-lg shadow overflow-hidden">
        {/* Mobile View - Card Layout */}
        <div className="sm:hidden space-y-4 p-4">
          {products.map((product) => (
            <div 
              key={product._id}
              onClick={() => navigate(`update/${product._id}`)}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{product.title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>دسته‌بندی: {product.categoryId?.name || "-"}</p>
                <p>برند: {product.brandId?.name || "-"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden sm:block w-full overflow-x-auto">
          <table className="w-full text-right divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase">عنوان</th>
                <th className="px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase">دسته‌بندی</th>
                <th className="px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase">برند</th>
                <th className="px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product._id}
                  onClick={() => navigate(`update/${product._id}`)}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">{product.title}</td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    {product.categoryId?.name || "-"}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    {product.brandId?.name || "-"}
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(product.createdAt).toLocaleDateString("fa-IR")}
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

      {products.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">محصولی یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllProduct;