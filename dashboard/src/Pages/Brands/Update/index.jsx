import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateBrand = () => {
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
    (async () => {
      try {
        const response = await fetchData(`brand/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.success) {
          setInitialData(response.data);
          setImage(response.data.image || null);
        } else {
          notify("برند یافت نشد!", "error");
          navigate("/brand");
        }
      } catch (err) {
        setError(err.response?.message || "خطا در دریافت اطلاعات برند");
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
      notify("تصویر حذف شد.", "success");
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
      const response = await fetchData(`brand/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify(response.message, "success");
        navigate("/brand");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "خطا در بروزرسانی برند");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("آیا از حذف این برند اطمینان دارید؟")) return;
    try {
      setLoading(true);
      const response = await fetchData(`brand/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        notify(response.message, "success");
        navigate("/brand");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      setError(err.response?.message || "خطا در حذف برند");
    } finally {
      setLoading(false);
    }
  };

  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined) return initialData[name];
    return "";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">ویرایش برند</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-right">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              نام برند *
            </label>
            <input
              name="name"
              value={getFieldValue("name")}
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
              accept="image/*"
            />
            {image && (
              <div className="mt-2 text-right">
                <p className="text-sm font-medium text-gray-700">تصویر آپلود شده:</p>
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 mt-2">
                  <img
                    src={import.meta.env.VITE_BASE_FILE + image}
                    alt="تصویر آپلود شده"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
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
            {loading ? "در حال بروزرسانی..." : uploading ? "در حال آپلود..." : "بروزرسانی برند"}
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
            {loading ? "در حال پردازش..." : "حذف برند"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBrand;