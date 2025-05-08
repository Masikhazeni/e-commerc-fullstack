import React, { useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateDiscountCode = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [fields, handleChange] = useFormFields({
    code: "",
    percent: "",
    startTime: "",
    expireTime: "",
    maxUsedCount: "1",
    maxPrice: "",
    minPrice: "",
    isActive: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code: fields.code,
        percent: Number(fields.percent),
        startTime: fields.startTime ? new Date(fields.startTime) : null,
        expireTime: fields.expireTime ? new Date(fields.expireTime) : null,
        maxUsedCount: Number(fields.maxUsedCount),
        maxPrice: fields.maxPrice ? Number(fields.maxPrice) : undefined,
        minPrice: fields.minPrice ? Number(fields.minPrice) : undefined,
        isActive: fields.isActive,
      };

      const response = await fetchData("discount", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.success) {
        notify("کد تخفیف با موفقیت ایجاد شد", "success");
        navigate("/discount-code");
      } else {
        notify(response.message || "خطا در ایجاد کد تخفیف", "error");
      }
    } catch (err) {
      notify("خطا در ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        ایجاد کد تخفیف جدید
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            کد تخفیف <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={fields.code}
            onChange={handleChange}
            placeholder="مثلاً: NEWYEAR50"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            درصد تخفیف <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="percent"
            value={fields.percent}
            onChange={handleChange}
            min="1"
            max="100"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="بین ۱ تا ۱۰۰"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            زمان شروع
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={fields.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            زمان انقضا
          </label>
          <input
            type="datetime-local"
            name="expireTime"
            value={fields.expireTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            حداکثر تعداد استفاده
          </label>
          <input
            type="number"
            name="maxUsedCount"
            value={fields.maxUsedCount}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سقف مبلغ تخفیف
          </label>
          <input
            type="number"
            name="maxPrice"
            value={fields.maxPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="اختیاری"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            حداقل مبلغ خرید
          </label>
          <input
            type="number"
            name="minPrice"
            value={fields.minPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="اختیاری"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={fields.isActive}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "isActive",
                  value: e.target.checked,
                },
              })
            }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-700">فعال باشد</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? "در حال ایجاد..." : "ایجاد کد تخفیف"}
        </button>
      </form>
    </div>
  );
};

export default CreateDiscountCode;

