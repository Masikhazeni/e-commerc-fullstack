import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateDiscountCode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // استفاده از هوک سفارشی برای مدیریت فیلدهای فرم
  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  // دریافت اطلاعات کد تخفیف برای پر کردن اولیه فرم
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`discount/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.success) {
          setInitialData(response.data);
        } else {
          notify("کد تخفیف یافت نشد", "error");
          navigate("/discount-code");
        }
      } catch (err) {
        notify("خطا در دریافت اطلاعات کد تخفیف", "error");
      }
    })();
  }, [id, token, navigate]);

  // تابع کمکی برای دریافت مقدار فعلی فیلدها
  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined) return initialData[name];
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...initialData,
        ...fields,
        percent: Number(getFieldValue("percent")),
        maxUsedCount: Number(getFieldValue("maxUsedCount")),
        maxPrice: getFieldValue("maxPrice") ? Number(getFieldValue("maxPrice")) : undefined,
        minPrice: getFieldValue("minPrice") ? Number(getFieldValue("minPrice")) : undefined,
        startTime: getFieldValue("startTime") ? new Date(getFieldValue("startTime")) : null,
        expireTime: getFieldValue("expireTime") ? new Date(getFieldValue("expireTime")) : null,
        isActive: getFieldValue("isActive"),
      };

      const response = await fetchData(`discount/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify("کد تخفیف با موفقیت به‌روزرسانی شد", "success");
        navigate("/discount-code");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("خطا در به‌روزرسانی کد تخفیف", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="flex justify-center items-center h-64">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-right">ویرایش کد تخفیف</h2>
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {/* کد تخفیف */}
        <div className="text-right">
          <label className="block text-sm md:text-base font-medium">کد تخفیف *</label>
          <input
            type="text"
            name="code"
            value={getFieldValue("code")}
            onChange={handleChange}
            placeholder="کد تخفیف را وارد کنید"
            className="w-full px-3 py-2 border rounded-md text-right"
            required
          />
        </div>

        {/* درصد تخفیف */}
        <div className="text-right">
          <label className="block text-sm md:text-base font-medium">درصد تخفیف *</label>
          <input
            type="number"
            name="percent"
            value={getFieldValue("percent")}
            onChange={handleChange}
            placeholder="درصد تخفیف را وارد کنید (1-100)"
            className="w-full px-3 py-2 border rounded-md text-right"
            min="1"
            max="100"
            required
          />
        </div>

        {/* زمان شروع */}
        <div className="text-right">
          <label className="block text-sm md:text-base font-medium">زمان شروع</label>
          <input
            type="datetime-local"
            name="startTime"
            value={getFieldValue("startTime") ? new Date(getFieldValue("startTime")).toISOString().slice(0,16) : ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-right"
          />
        </div>

        {/* زمان انقضا */}
        <div className="text-right">
          <label className="block text-sm md:text-base font-medium">زمان انقضا</label>
          <input
            type="datetime-local"
            name="expireTime"
            value={getFieldValue("expireTime") ? new Date(getFieldValue("expireTime")).toISOString().slice(0,16) : ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-right"
          />
        </div>

        {/* حداکثر تعداد استفاده */}
        <div className="text-right">
          <label className="block text-sm md:text-base font-medium">حداکثر تعداد استفاده</label>
          <input
            type="number"
            name="maxUsedCount"
            value={getFieldValue("maxUsedCount")}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-right"
            min="1"
          />
        </div>

        {/* حداکثر قیمت */}
        <div className="text-right">
          <label className="block text-sm md:text-base font-medium">حداکثر قیمت</label>
          <input
            type="number"
            name="maxPrice"
            value={getFieldValue("maxPrice")}
            onChange={handleChange}
            placeholder="حداکثر قیمت را وارد کنید"
            className="w-full px-3 py-2 border rounded-md text-right"
          />
        </div>

        {/* حداقل قیمت */}
        <div className="text-right">
          <label className="block text-sm md:text-base font-medium">حداقل قیمت</label>
          <input
            type="number"
            name="minPrice"
            value={getFieldValue("minPrice")}
            onChange={handleChange}
            placeholder="حداقل قیمت را وارد کنید"
            className="w-full px-3 py-2 border rounded-md text-right"
          />
        </div>

        {/* وضعیت فعال بودن */}
        <div className="flex items-center justify-end">
          <label className="flex items-center text-sm md:text-base font-medium">
            <span className="ml-2">فعال باشد؟</span>
            <input
              type="checkbox"
              name="isActive"
              checked={getFieldValue("isActive")}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "isActive",
                    value: e.target.checked,
                  },
                })
              }
              className="ml-2"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
        >
          {loading ? "در حال به‌روزرسانی..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
};

export default UpdateDiscountCode;
