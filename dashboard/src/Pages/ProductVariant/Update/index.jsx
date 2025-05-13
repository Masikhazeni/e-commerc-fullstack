import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateProductVariant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const prodResponse = await fetchData("product?limit=1000", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (prodResponse.success) {
          setProducts(prodResponse.data);
        }
        const varResponse = await fetchData("variant", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (varResponse.success) {
          setVariants(varResponse.data);
        }
      } catch (err) {
        notify("خطا در دریافت محصولات یا متغیرها", "error");
      }
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`product-variant/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.success) {
          setInitialData(response.data);
        } else {
          notify("متغیر محصول یافت نشد!", "error");
          navigate("/product-variant");
        }
      } catch (err) {
        notify("خطا در دریافت جزئیات متغیر محصول", "error");
      }
    })();
  }, [id, token, navigate]);

  const computePriceAfterDiscount = () => {
    const price = Number(fields.price !== undefined ? fields.price : initialData?.price);
    const discount = Number(fields.discount !== undefined ? fields.discount : initialData?.discount);
    if (!isNaN(price) && !isNaN(discount)) {
      return (price - price * (discount / 100)).toFixed(2);
    }
    return "";
  };

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
        price: Number(getFieldValue("price")),
        discount: Number(getFieldValue("discount")),
        quantity: Number(getFieldValue("quantity")),
        priceAfterDiscount: Number(computePriceAfterDiscount()),
      };

      const response = await fetchData(`product-variant/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify("متغیر محصول با موفقیت به‌روزرسانی شد", "success");
        navigate("/product-variant");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("خطا در به‌روزرسانی متغیر محصول", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="flex justify-center items-center h-64">
        بارگذاری...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">بروزرسانی متغیر محصول</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">قیمت *</label>
          <input
            type="number"
            name="price"
            value={getFieldValue("price")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="قیمت را وارد کنید"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">تخفیف (%)</label>
          <input
            type="number"
            name="discount"
            value={getFieldValue("discount")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="درصد تخفیف را وارد کنید"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">تعداد *</label>
          <input
            type="number"
            name="quantity"
            value={getFieldValue("quantity")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="تعداد را وارد کنید"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">محصول *</label>
          <select
            name="productId"
            value={initialData?.productId?._id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">یک محصول انتخاب کنید</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.title || prod.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">متغیر *</label>
          <select
            name="variantId"
            value={initialData?.variantId?._id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">یک متغیر انتخاب کنید</option>
            {variants.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">قیمت پس از تخفیف:</label>
          <p className="mt-1 text-lg font-semibold">
            {computePriceAfterDiscount() ? `${computePriceAfterDiscount()} تومان` : "-"}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "در حال به‌روزرسانی..." : "بروزرسانی متغیر محصول"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProductVariant;
