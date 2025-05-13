import React, { useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateSlider = () => {
  const [fields, handleChange] = useFormFields(); // ساده، بدون مقدار اولیه
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetchData("upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.success) {
        notify("آپلود تصویر ناموفق بود!", "error");
      } else {
        setImage(response.file.filename);
        notify("تصویر با موفقیت آپلود شد!", "success");
      }
    } catch {
      notify("خطا در آپلود تصویر", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fields.title || !fields.href || !image) {
      notify("همه فیلدها الزامی هستند", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchData("slider", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...fields, image }),
      });

      if (response.success) {
        notify(response.message || "اسلایدر با موفقیت ایجاد شد", "success");
        navigate("/slider");
      } else {
        notify(response.message || "خطا در ایجاد اسلایدر", "error");
      }
    } catch {
      notify("خطای سرور هنگام ایجاد اسلایدر", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">ایجاد اسلایدر جدید</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* عنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">نام اسلایدر</label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              placeholder="نام اسلاید را وارد کنید"
              required
            />
          </div>

          {/* لینک */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">آدرس</label>
            <input
              type="text"
              name="href"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              placeholder="آدرس را وارد کنید"
              required
            />
          </div>

          {/* آپلود تصویر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">تصویر برند *</label>
            <input
              type="file"
              name="image"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              disabled={uploading}
              required
              accept="image/*"
            />
            {image && (
              <div className="mt-3 text-right">
                <p className="text-sm font-medium text-gray-700">پیش‌نمایش:</p>
                <img
                  src={`${import.meta.env.VITE_BASE_FILE}${image}`}
                  alt="تصویر آپلود شده"
                  className="mt-2 w-24 h-24 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* دکمه ارسال */}
          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              loading || uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "در حال ایجاد..." : uploading ? "در حال آپلود..." : "ایجاد اسلایدر"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSlider;

