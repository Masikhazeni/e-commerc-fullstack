import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateSlider = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const response = await fetchData(`slider/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (response.success) {
          setInitialData(response.data);
          setImage(response.data.image || null);
        } else {
          notify("اسلایدر یافت نشد!", "error");
          navigate("/slider");
        }
      } catch (err) {
        setError(err.response?.message || "خطا در دریافت اطلاعات اسلایدر");
      }
    };

    fetchSlider();
  }, [id, token, navigate]);

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

    if (response.success) {
      setImage(response.file.filename);
      notify("تصویر با موفقیت آپلود شد", "success");
    } else {
      notify("آپلود تصویر ناموفق بود", "error");
    }

    setUploading(false);
  };

  const handleRemoveImage = async () => {
    if (!image) return;

    const response = await fetchData("upload", {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName: image }),
    });

    if (response.success) {
      setImage(null);
      notify("تصویر حذف شد", "success");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...initialData,
      ...fields,
      image,
    };

    try {
      const response = await fetchData(`slider/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.success) {
        notify(response.message, "success");
        navigate("/slider");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "خطا در بروزرسانی اسلایدر");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("آیا از حذف این اسلایدر اطمینان دارید؟")) return;

    setLoading(true);
    try {
      const response = await fetchData(`slider/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        notify(response.message, "success");
        navigate("/slider");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "خطا در حذف اسلایدر");
    } finally {
      setLoading(false);
    }
  };

  const getFieldValue = (name) => {
    return fields[name] ?? initialData?.[name] ?? "";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">ویرایش اسلایدر</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-right">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              نام اسلایدر *
            </label>
            <input
              name="title"
              value={getFieldValue("title")}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              placeholder="نام اسلایدر را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              آدرس لینک
            </label>
            <input
              name="href"
              value={getFieldValue("href")}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              placeholder="آدرس لینک را وارد کنید"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              تصویر اسلایدر *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            />

            {image && (
              <div className="mt-3 text-right">
                <p className="text-sm text-gray-700">تصویر فعلی:</p>
                <div className="flex items-center justify-end gap-3 mt-2">
                  <img
                    src={import.meta.env.VITE_BASE_FILE + image}
                    alt="تصویر اسلایدر"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    حذف تصویر
                  </button>
                </div>
              </div>
            )}
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
            {loading ? "در حال بروزرسانی..." : uploading ? "در حال آپلود..." : "بروزرسانی اسلایدر"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "در حال پردازش..." : "حذف اسلایدر"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSlider;
