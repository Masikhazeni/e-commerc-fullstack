import { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllComments = () => {
  const { token } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetchData(
          `comment?page=${currentPage}&limit=${itemsPerPage}&populate=productId,userId`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.success) {
          setComments(response.data);
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
    
    fetchComments();
  }, [currentPage, itemsPerPage, token]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("آیا از حذف این نظر مطمئن هستید؟");
      if (!confirmDelete) return;

      const response = await fetchData(`comment/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        setComments(comments.filter((comment) => comment._id !== id));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleIsActive = async (id) => {
    try {
      const comment = comments.find((c) => c._id === id);
      const response = await fetchData(`comment/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        setComments(
          comments.map((c) =>
            c._id === id ? { ...c, isActive: !c.isActive } : c
          )
        );
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">مدیریت نظرات</h1>

      {/* نمایش موبایل (کارت‌ها) */}
      <div className="block lg:hidden space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">متن نظر:</span>
                <p className="text-gray-800 mt-1">{comment.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-sm text-gray-600">کاربر:</span>
                  <p className="text-sm">
                    {comment.userId?.username || comment.userId?.phoneNumber || "ناشناس"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">محصول:</span>
                  <p className="text-sm">
                    {comment.productId?.title || "ناشناس"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">پاسخ:</span>
                  <p className="text-sm">
                    {comment.reply || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">وضعیت:</span>
                  <button
                    onClick={() => toggleIsActive(comment._id)}
                    className={`px-2 text-xs font-semibold rounded-full ${
                      comment.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {comment.isActive ? "فعال" : "غیرفعال"}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => navigate(`reply/${comment._id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    پاسخ
                  </button>
                </div>
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">متن نظر</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">کاربر</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">محصول</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">پاسخ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => (
                <tr key={comment._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {comment.content}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {comment.userId?.username || comment.userId?.phoneNumber || "ناشناس"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {comment.productId?.title || "ناشناس"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {comment.reply || "-"}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleIsActive(comment._id)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        comment.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {comment.isActive ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium flex gap-3">
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                    <button
                      onClick={() => navigate(`reply/${comment._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      پاسخ
                    </button>
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

      {comments.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">نظری یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllComments;