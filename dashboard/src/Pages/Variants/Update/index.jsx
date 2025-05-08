import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";

const UpdateVariant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState({ type: "size", value: "" });
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const response = await fetchData(`variant/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.success) {
          setFields(response.data);
        }
      } catch (error) {
        notify("خطا در دریافت اطلاعات متغیر", "error");
      }
    };

    fetchVariant();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchData(`variant/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (response.success) {
        notify("متغیر با موفقیت بروزرسانی شد", "success");
        navigate("/variant");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("خطا در بروزرسانی متغیر", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-right">ویرایش متغیر</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع *</label>
          <select
            name="type"
            value={fields.type || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="size">اندازه</option>
            <option value="color">رنگ</option>
          </select>
        </div>

        {/* Value Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">مقدار *</label>
          <input
            name="value"
            value={fields.value || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="مقدار متغیر را وارد کنید"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "در حال بروزرسانی..." : "ویرایش متغیر"}
        </button>
      </form>
    </div>
  );
};

export default UpdateVariant;

