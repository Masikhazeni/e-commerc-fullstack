import { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { token } = useSelector((state) => state.auth);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchData(
          `category?page=${currentPage}&limit=${itemsPerPage}&populate=parentCategory`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.success) {
          setCategories(response.data);
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

    fetchCategories();
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
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2 text-right">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6" style={{ direction: "rtl" }}>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">لیست دسته‌بندی‌ها</h1>

      {/* نمایش موبایل (کارت‌ها) */}
      <div className="block lg:hidden space-y-4">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => navigate(`update/${category._id}`)}
            className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {category.image && (
                <img
                  src={`${import.meta.env.VITE_BASE_FILE}${category.image}`}
                  alt={category.name}
                  className="h-16 w-16 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{category.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 text-xs font-semibold rounded-full ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  والد: {category.parentCategory?.name || "ندارد"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(category.createdAt).toLocaleDateString('fa-IR')}
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تصویر</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">دسته والد</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr
                  key={category._id}
                  onClick={() => navigate(`update/${category._id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    {category.image && (
                      <img
                        src={`${import.meta.env.VITE_BASE_FILE}${category.image}`}
                        alt={category.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.parentCategory?.name || "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString('fa-IR')}
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

      {categories.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">دسته‌بندی‌ای یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllCategory;
