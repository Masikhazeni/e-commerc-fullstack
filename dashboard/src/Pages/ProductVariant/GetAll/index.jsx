import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllProductVariant = () => {
  const [variantsList, setVariantsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState("");

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const sortQuery = sort ? `&sort=${sort}` : "";
        const response = await fetchData(
          `product-variant?page=${currentPage}&limit=${itemsPerPage}&populate=productId,variantId${sortQuery}`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }
        );
        if (response.success) {
          setVariantsList(response.data);
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

    fetchVariants();
  }, [currentPage, itemsPerPage, sort, token]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sort === field) {
      setSort(`-${field}`);
    } else if (sort === `-${field}`) {
      setSort(field);
    } else {
      setSort(field);
    }
    setCurrentPage(1);
  };

  const renderSortIndicator = (field) => {
    if (sort === field) return " ↑";
    if (sort === `-${field}`) return " ↓";
    return "";
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">تمام انواع محصولات</h1>

      <div className="w-full bg-white rounded-lg shadow overflow-hidden">
        {/* Mobile View - Card Layout */}
        <div className="sm:hidden space-y-4 p-4">
          {variantsList.map((item) => (
            <div 
              key={item._id}
              onClick={() => navigate(`update/${item._id}`)}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">
                  {item.productId?.title || item.productId?.name || "-"}
                </h3>
                <span className="text-sm text-gray-500">
                  {item.variantId?.value || "-"}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                <p>قیمت: {item.price.toLocaleString()} تومان</p>
                <p>تخفیف: {item.discount}٪</p>
                <p>تعداد: {item.quantity}</p>
                <p>
                  قیمت نهایی:{" "}
                  {(item.priceAfterDiscount
                    ? item.priceAfterDiscount
                    : item.price - item.price * (item.discount / 100)
                  ).toLocaleString()} تومان
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden sm:block w-full overflow-x-auto">
          <table className="w-full text-right divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("price")}
                  className="cursor-pointer px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase"
                >
                  قیمت {renderSortIndicator("price")}
                </th>
                <th
                  onClick={() => handleSort("discount")}
                  className="cursor-pointer px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase"
                >
                  تخفیف {renderSortIndicator("discount")}
                </th>
                <th
                  onClick={() => handleSort("quantity")}
                  className="cursor-pointer px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase"
                >
                  تعداد {renderSortIndicator("quantity")}
                </th>
                <th
                  onClick={() => handleSort("priceAfterDiscount")}
                  className="cursor-pointer px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase"
                >
                  قیمت بعد از تخفیف {renderSortIndicator("priceAfterDiscount")}
                </th>
                <th
                  onClick={() => handleSort("productId")}
                  className="cursor-pointer px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase"
                >
                  محصول {renderSortIndicator("productId")}
                </th>
                <th
                  onClick={() => handleSort("variantId")}
                  className="cursor-pointer px-4 py-3 sm:px-6 sm:py-3 text-xs font-semibold text-gray-600 uppercase"
                >
                  نوع محصول {renderSortIndicator("variantId")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {variantsList.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => navigate(`update/${item._id}`)}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    {item.price.toLocaleString()} تومان
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    {item.discount}٪
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    {(item.priceAfterDiscount
                      ? item.priceAfterDiscount
                      : item.price - item.price * (item.discount / 100)
                    ).toLocaleString()} تومان
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    {item.productId?.title || item.productId?.name || "-"}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    {item.variantId?.value || "-"}
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

      {variantsList.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">هیچ نوع محصولی یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllProductVariant;
