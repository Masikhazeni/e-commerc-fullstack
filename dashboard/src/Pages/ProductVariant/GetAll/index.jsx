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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">تمام انواع محصولات</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-right">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("price")}
                  className="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                >
                  قیمت {renderSortIndicator("price")}
                </th>
                <th
                  onClick={() => handleSort("discount")}
                  className="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                >
                  تخفیف {renderSortIndicator("discount")}
                </th>
                <th
                  onClick={() => handleSort("quantity")}
                  className="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                >
                  تعداد {renderSortIndicator("quantity")}
                </th>
                <th
                  onClick={() => handleSort("priceAfterDiscount")}
                  className="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                >
                  قیمت بعد از تخفیف {renderSortIndicator("priceAfterDiscount")}
                </th>
                <th
                  onClick={() => handleSort("productId")}
                  className="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                >
                  محصول {renderSortIndicator("productId")}
                </th>
                <th
                  onClick={() => handleSort("variantId")}
                  className="cursor-pointer px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                >
                  نوع محصول {renderSortIndicator("variantId")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {variantsList.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => navigate(`update/${item._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.price.toLocaleString()} تومان
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.discount}٪
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(item.priceAfterDiscount
                      ? item.priceAfterDiscount
                      : item.price - item.price * (item.discount / 100)
                    ).toLocaleString()} تومان
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.productId?.title || item.productId?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.variantId?.value || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              قبلی
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              بعدی
            </button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                نمایش {(currentPage - 1) * itemsPerPage + 1} تا{" "}
                {Math.min(currentPage * itemsPerPage, totalCount)} از{" "}
                {totalCount} نتیجه
              </p>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10 در هر صفحه</option>
                <option value={20}>20 در هر صفحه</option>
                <option value={50}>50 در هر صفحه</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                قبلی
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                بعدی
              </button>
            </div>
          </div>
        </div>
      </div>

      {variantsList.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          هیچ نوع محصولی یافت نشد
        </div>
      )}
    </div>
  );
};

export default GetAllProductVariant;
