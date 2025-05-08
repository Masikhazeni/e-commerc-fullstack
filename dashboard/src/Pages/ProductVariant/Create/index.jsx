import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateProductVariant = () => {
  // Basic fields for product variant
  const [fields, handleChange] = useFormFields({
    price: "",
    discount: "0",
    quantity: "",
    productId: "",
    variantId: "",
  });
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Lists of products and variants for selection
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products and variants on mount
  useEffect(() => {
    (async () => {
      try {
        const prodResponse = await fetchData("product", {
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
        notify("خطا در دریافت اطلاعات محصولات یا انواع", "error");
      }
    })();
  }, [token]);

  // Calculate price after discount on the fly
  const computePriceAfterDiscount = () => {
    const price = Number(fields.price);
    const discount = Number(fields.discount);
    if (!isNaN(price) && !isNaN(discount)) {
      return (price - price * (discount / 100)).toFixed(2);
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...fields,
        price: Number(fields.price),
        discount: Number(fields.discount),
        quantity: Number(fields.quantity),
        priceAfterDiscount: Number(computePriceAfterDiscount()),
      };

      const response = await fetchData("product-variant", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.success) {
        notify("نوع محصول با موفقیت ایجاد شد", "success");
        navigate("/product-variant");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("خطا در ایجاد نوع محصول", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ایجاد نوع جدید محصول</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Price Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">قیمت *</label>
          <input
            type="number"
            name="price"
            value={fields.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="قیمت را وارد کنید"
            required
          />
        </div>

        {/* Discount Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">تخفیف (%)</label>
          <input
            type="number"
            name="discount"
            value={fields.discount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="درصد تخفیف را وارد کنید"
            min="0"
            max="100"
          />
        </div>

        {/* Quantity Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">تعداد *</label>
          <input
            type="number"
            name="quantity"
            value={fields.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="تعداد را وارد کنید"
            required
          />
        </div>

        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">محصول *</label>
          <select
            name="productId"
            value={fields.productId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">یک محصول را انتخاب کنید</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.title || prod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Variant Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">نوع محصول *</label>
          <select
            name="variantId"
            value={fields.variantId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">یک نوع محصول را انتخاب کنید</option>
            {variants.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.value}
              </option>
            ))}
          </select>
        </div>

        {/* Computed Price After Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            قیمت بعد از تخفیف:
          </label>
          <p className="mt-1 text-lg font-semibold">
            {computePriceAfterDiscount() ? `${computePriceAfterDiscount()}$` : "-"}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "در حال ایجاد..." : "ایجاد نوع محصول"}
        </button>
      </form>
    </div>
  );
};

export default CreateProductVariant;



