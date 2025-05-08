import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useSelector } from "react-redux";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [fields, handleChange] = useFormFields();
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData("category", {
          method: "GET",
          authorization: `Bearer ${token}`,
        });
        setParentCategories(response.data);
      } catch (err) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", err);
      }
    })();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchData("upload", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.success) {
      notify("آپلود تصویر ناموفق بود!", "error");
      return;
    }
    setImage(response.file.filename);
    notify("تصویر با موفقیت آپلود شد!", "success");
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchData("category", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...fields, image }),
      });
      if (response.success) {
        notify(response?.message, "success");
        navigate("/category");
      } else {
        notify(response?.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "خطا در ایجاد دسته‌بندی");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-right">
          ایجاد دسته‌بندی جدید
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-right">
              {error}
            </div>
          )}

          <div className="text-right">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام دسته‌بندی *
            </label>
            <input
              onChange={handleChange}
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              required
            />
          </div>

          <div className="text-right">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              دسته‌بندی والد
            </label>
            <select
              onChange={handleChange}
              name="parentCategory"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            >
              <option value="">بدون والد</option>
              {parentCategories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              تصاویر *
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageUpload}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              disabled={uploading}
              accept="image/*"
              required
            />
            {error?.images && (
              <p className="text-red-500 text-sm mt-1 text-right">{error.images}</p>
            )}
            {image && (
              <div className="mt-2 text-right">
                <p className="text-sm font-medium text-gray-700">تصویر آپلود شده:</p>
                <div className="flex justify-end mt-1">
                  <img
                    src={import.meta.env.VITE_BASE_FILE + image}
                    alt="تصویر آپلود شده"
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
            <label className="ml-2 text-sm text-gray-700">دسته‌بندی فعال</label>
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              loading || uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading
              ? "در حال ایجاد..."
              : uploading
              ? "در حال آپلود..."
              : "ایجاد دسته‌بندی"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
