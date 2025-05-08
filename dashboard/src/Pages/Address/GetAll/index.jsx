import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const {token} = useSelector(state => state.auth);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetchData(`address?page=${currentPage}&limit=${itemsPerPage}`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`
          }
        });
        if (response.success) {
          setAddresses(response.data);
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

    fetchAddresses();
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
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{ direction: 'rtl' }}>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">لیست آدرس‌ها</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  شهر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام گیرنده
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تلفن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کد پستی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  خیابان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  استان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ ایجاد
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {addresses.map((address) => (
                <tr
                  key={address._id}
                  onClick={() => navigate(`update/${address._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{address.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{address.receiverName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{address.receiverPhoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{address.postalCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{address.street}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{address.province}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(address.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* کنترل‌های صفحه‌بندی */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              قبلی
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              بعدی
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                نمایش <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> تا{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> از{" "}
                <span className="font-medium">{totalCount}</span> نتیجه
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
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                قبلی
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                بعدی
              </button>
            </div>
          </div>
        </div>
      </div>

      {addresses.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">آدرسی یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllAddress;