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
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("آیا از حذف این نظر اطمینان دارید؟");
    if (!confirmDelete) return;

    try {
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
        body: JSON.stringify({ isActive: !comment.isActive }),
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
      <div className="flex justify-center items-center h-64" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2" dir="rtl">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">همه‌ی نظرات</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">متن</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">کاربر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">محصول</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">پاسخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => (
                <tr key={comment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{comment.content}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {comment.userId?.username || comment.userId?.phoneNumber || "ناشناخته"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {comment.productId?.title || "ناشناخته"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{comment.reply || "-"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleIsActive(comment._id);
                      }}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        comment.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {comment.isActive ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(comment._id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      حذف
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`reply/${comment._id}`);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      پاسخ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* کنترل صفحه‌بندی */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex gap-4 items-center text-sm text-gray-700">
            <span>
              نمایش {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} تا{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} از {totalCount}
            </span>
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
              className="px-4 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              قبلی
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>

      {comments.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">هیچ نظری یافت نشد</div>
      )}
    </div>
  );
};

export default GetAllComments;
