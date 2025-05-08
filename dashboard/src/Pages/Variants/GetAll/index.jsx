import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const GetAllVariant = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState("-createdAt");
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVariants = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          `variant?page=${currentPage}&limit=${itemsPerPage}&sort=${sort}`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        if (response.success) {
          setVariants(response.data);
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
    if (sort === field) setSort(`-${field}`);
    else if (sort === `-${field}`) setSort(field);
    else setSort(field);
  };

  const renderSortIcon = (field) => {
    if (sort === field) return <FaSortUp className="inline mr-1" />;
    if (sort === `-${field}`) return <FaSortDown className="inline mr-1" />;
    return <FaSort className="inline mr-1 text-gray-400" />;
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-right">لیست متغیرها</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-right">
            <thead className="bg-gray-50">
              <tr>
                {["type", "value", "createdAt"].map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-end gap-1">
                      {field === "createdAt"
                        ? "تاریخ ایجاد"
                        : field === "type"
                        ? "نوع"
                        : "مقدار"}
                      {renderSortIcon(field)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.map((variant) => (
                <tr
                  key={variant._id}
                  onClick={() => navigate(`update/${variant._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{variant.type === "size" ? "اندازه" : "رنگ"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{variant.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variant.createdAt
                      ? new Date(variant.createdAt).toLocaleDateString("fa-IR")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-700">
            نمایش{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            تا{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalCount)}
            </span>{" "}
            از{" "}
            <span className="font-medium">{totalCount}</span> مورد
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value={10}>۱۰ در هر صفحه</option>
              <option value={20}>۲۰ در هر صفحه</option>
              <option value={50}>۵۰ در هر صفحه</option>
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

      {variants.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">متغیری یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllVariant;

