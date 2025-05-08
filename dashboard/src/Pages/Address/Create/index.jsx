import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateAddress = () => {
  const [fields, handleChange] = useFormFields();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchData("user", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.success) {
          setUsers(response.data);
        } else {
          notify("خطا در دریافت لیست کاربران", "error");
        }
      } catch (err) {
        notify("خطا در ارتباط با سرور", "error");
      }
    };

    fetchUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchData("address", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (response.success) {
        notify("آدرس با موفقیت ایجاد شد", "success");
        navigate("/address");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("خطا در ایجاد آدرس", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md" style={{ direction: 'rtl' }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ایجاد آدرس جدید</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* شهر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شهر *</label>
          <input
            name="city"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام شهر را وارد کنید"
          />
        </div>

        {/* نام گیرنده */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام گیرنده *</label>
          <input
            name="receiverName"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام گیرنده را وارد کنید"
          />
        </div>

        {/* شماره تماس گیرنده */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس گیرنده *</label>
          <input
            name="receiverPhoneNumber"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="شماره تماس گیرنده را وارد کنید"
          />
        </div>

        {/* کد پستی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کد پستی *</label>
          <input
            name="postalCode"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="کد پستی را وارد کنید"
          />
        </div>

        {/* خیابان */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">خیابان *</label>
          <input
            name="street"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام خیابان را وارد کنید"
          />
        </div>

        {/* پلاک */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">پلاک *</label>
          <input
            name="plaque"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="شماره پلاک را وارد کنید"
          />
        </div>

        {/* استان */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">استان *</label>
          <input
            name="province"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام استان را وارد کنید"
          />
        </div>

        {/* توضیحات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <textarea
            name="description"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="توضیحات اضافه (اختیاری)"
          ></textarea>
        </div>

        {/* انتخاب کاربر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کاربر *</label>
          <select
            name="userId"
            value={fields.userId || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">انتخاب کاربر</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name || user.phoneNumber}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "در حال ایجاد..." : "ایجاد آدرس"}
        </button>
      </form>
    </div>
  );
};

export default CreateAddress;