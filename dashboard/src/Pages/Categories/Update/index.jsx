import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateCategory = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData("category", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        setParentCategories(response.data);
      } catch (err) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", err);
      }
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`category/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.success) {
          setInitialData(response.data);
          setImage(response.data.image || null);
        } else {
          notify("دسته‌بندی پیدا نشد!", "error");
          navigate("/category");
        }
      } catch (err) {
        setError(err.response?.message || "خطا در دریافت اطلاعات دسته‌بندی");
      }
    })();
  }, [id, token, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchData("upload", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.success) {
      notify("آپلود تصویر با خطا مواجه شد!", "error");
    } else {
      setImage(response.file.filename);
      notify("تصویر با موفقیت آپلود شد", "success");
    }

    setUploading(false);
  };

  const handleRemoveImage = async () => {
    const response = await fetchData("upload", {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ fileName: image }),
    });

    if (response?.success) {
      setImage(null);
      notify("تصویر حذف شد", "success");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...initialData,
        ...fields,
        image,
      };

      const response = await fetchData(`category/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.success) {
        notify(response.message, "success");
        navigate("/category");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "خطا در بروزرسانی دسته‌بندی");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) return;
    try {
      setLoading(true);
      const response = await fetchData(`category/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });

      if (response.success) {
        notify(response.message, "success");
        navigate("/category");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "خطا در حذف دسته‌بندی");
    } finally {
      setLoading(false);
    }
  };

  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined)
      return initialData[name];
    return "";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ویرایش دسته‌بندی</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام دسته‌بندی *</label>
          <input
            name="name"
            value={getFieldValue("name")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی والد</label>
          <select
            name="parentCategory"
            value={getFieldValue("parentCategory")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">هیچ‌کدام</option>
            {parentCategories?.map(
              (category) =>
                category._id !== id && (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                )
            )}
          </select>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            تصویر *
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageUpload}
            disabled={uploading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {image && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">تصویر آپلود شده:</p>
              <div className="flex items-center space-x-2 mt-1 flex-row-reverse">
                <img
                  src={import.meta.env.VITE_BASE_FILE + image}
                  alt="تصویر"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-2 py-1 bg-red-500 text-white rounded-md text-sm"
                >
                  حذف تصویر
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end">
          <input
            type="checkbox"
            name="isActive"
            checked={!!getFieldValue("isActive")}
            onChange={(e) =>
              handleChange({
                target: { name: "isActive", value: e.target.checked },
              })
            }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded ml-2"
          />
          <label className="text-sm text-gray-700">فعال بودن دسته‌بندی</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "در حال بروزرسانی..." : "بروزرسانی دسته‌بندی"}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-300"
        >
          {loading ? "در حال حذف..." : "حذف دسته‌بندی"}
        </button>
      </div>
    </div>
  );
};

export default UpdateCategory;
