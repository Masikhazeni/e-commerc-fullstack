import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";

const UpdateAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDataForUpdate = async () => {
      try {
        // دریافت اطلاعات آدرس
        const addressResponse = await fetchData(`address/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });

        if (addressResponse.success) {
          setFields(addressResponse.data);
        }

        // دریافت لیست کاربران
        const usersResponse = await fetchData("user", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });

        if (usersResponse.success) {
          setUsers(usersResponse.data);
        }
      } catch (error) {
        console.log(error)
        notify("خطا در دریافت اطلاعات", "error");
      }
    };

    fetchDataForUpdate();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchData(`address/${id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      if (response.success) {
        notify("آدرس با موفقیت ویرایش شد", "success");
        navigate("/address");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("خطا در ویرایش آدرس", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md" style={{ direction: 'rtl' }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ویرایش آدرس</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* فیلد شهر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شهر *</label>
          <input
            name="city"
            value={fields.city || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام شهر را وارد کنید"
            required
          />
        </div>

        {/* نام گیرنده */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام گیرنده *</label>
          <input
            name="receiverName"
            value={fields.receiverName || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام گیرنده را وارد کنید"
            required
          />
        </div>

        {/* شماره تماس گیرنده */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس گیرنده *</label>
          <input
            name="receiverPhoneNumber"
            value={fields.receiverPhoneNumber || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="شماره تماس گیرنده را وارد کنید"
            required
          />
        </div>

        {/* کد پستی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کد پستی *</label>
          <input
            name="postalCode"
            value={fields.postalCode || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="کد پستی را وارد کنید"
            required
          />
        </div>

        {/* خیابان */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">خیابان *</label>
          <input
            name="street"
            value={fields.street || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام خیابان را وارد کنید"
            required
          />
        </div>

        {/* پلاک */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">پلاک *</label>
          <input
            name="plaque"
            value={fields.plaque || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="شماره پلاک را وارد کنید"
            required
          />
        </div>

        {/* استان */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">استان *</label>
          <input
            name="province"
            value={fields.province || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="نام استان را وارد کنید"
            required
          />
        </div>

        {/* توضیحات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <textarea
            name="description"
            value={fields.description || ""}
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
            value={String(fields.userId) || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">انتخاب کاربر</option>
            {users.map((user) => (
              <option key={user._id} value={String(user._id)}>
                {user.name || user.email || user.phoneNumber}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "در حال ویرایش..." : "ویرایش آدرس"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAddress;