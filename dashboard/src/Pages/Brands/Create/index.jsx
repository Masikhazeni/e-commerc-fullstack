import React, { useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateBrand = () => {
  const [fields, handleChange] = useFormFields();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
      setUploading(false);
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
      const response = await fetchData("brand", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...fields, image }),
      });
      if (response.success) {
        notify(response.message, "success");
        navigate("/brand");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify(err.response?.message || "خطا در ایجاد برند", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">ایجاد برند جدید</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              نام برند *
            </label>
            <input
              name="name"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              placeholder="نام برند را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              تصویر برند *
            </label>
            <input
              type="file"
              name="image"
              onChange={handleImageUpload}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              disabled={uploading}
              required
              accept="image/*"
            />
            {image && (
              <div className="mt-2 text-right">
                <p className="text-sm font-medium text-gray-700">تصویر آپلود شده:</p>
                <div className="flex justify-end mt-2">
                  <img
                    src={import.meta.env.VITE_BASE_FILE + image}
                    alt="تصویر آپلود شده"
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploading || !image}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              loading || uploading || !image
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "در حال ایجاد..." : uploading ? "در حال آپلود..." : "ایجاد برند"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBrand;
