import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  // useFormFields returns only modified fields
  const [fields, handleChange] = useFormFields();
  const [initialData, setInitialData] = useState(null);
  const [images, setImages] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [information, setInformation] = useState([]);
  const [infoKey, setInfoKey] = useState("");
  const [infoValue, setInfoValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
   const [difaultVar, setDifaultVar] = useState([]);

  // دریافت دسته‌بندی‌ها و برندها
  useEffect(() => {
    (async () => {
      try {
        const catResponse = await fetchData("category?limit=1000", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (catResponse.success) {
          setCategories(catResponse.data);
        }
        const brandResponse = await fetchData("brand", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (brandResponse.success) {
          setBrands(brandResponse.data);
        }
      } catch (err) {
        notify("خطا در دریافت دسته‌بندی‌ها یا برندها", "error");
      }
    })();
  }, [token]);
    useEffect(() => {
    (async () => {
      try {
        const defaultVarResponse = await fetchData(`product-variant?productId=${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` }
        });
        if (defaultVarResponse.success) {
          setDifaultVar(defaultVarResponse.data);
        }

        const brandResponse = await fetchData("brand", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (brandResponse.success) {
          setBrands(brandResponse.data);
        }
      } catch (err) {
        notify("خطا در دریافت دسته‌بندی یا برند", "error");
      }
    })();
  }, [token]);

  // دریافت اطلاعات محصول
  useEffect(() => {
    (async () => {
      try {
        const response = await fetchData(`product/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.success) {
          setInitialData(response.data.product);
          setImages(response.data.product.imagesUrl || []);
          setInformation(response.data.product.information || []);
        } else {
          notify("محصول یافت نشد!", "error");
          navigate("/product");
        }
      } catch (err) {
        notify("خطا در دریافت اطلاعات محصول", "error");
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
      headers: { authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.success) {
      notify("آپلود تصویر ناموفق بود!", "error");
      setUploading(false);
      return;
    }
    
    setImages((prev) => [...prev, response.file.filename]);
    notify("تصویر با موفقیت آپلود شد!", "success");
    setUploading(false);
  };

  const handleAddInformation = () => {
    if (infoKey.trim() && infoValue.trim()) {
      setInformation((prev) => [...prev, { key: infoKey.trim(), value: infoValue.trim() }]);
      setInfoKey("");
      setInfoValue("");
    }
  };

  // ارسال اطلاعات ویرایش شده
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...initialData,
        ...fields, // only modified fields
        imagesUrl: images,
        information,
      };
      const response = await fetchData(`product/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.success) {
        notify("محصول با موفقیت به‌روزرسانی شد", "success");
        navigate("/product");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("خطا در به‌روزرسانی محصول", "error");
    } finally {
      setLoading(false);
    }
  };

  // دریافت مقدار فعلی فیلدها
  const getFieldValue = (name) => {
    if (fields[name] !== undefined) return fields[name];
    if (initialData && initialData[name] !== undefined) return initialData[name];
    return "";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ویرایش محصول</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* فیلد عنوان */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عنوان *</label>
          <input
            name="title"
            value={getFieldValue("title")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            placeholder="عنوان محصول را وارد کنید"
            required
          />
        </div>

        {/* فیلد توضیحات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات *</label>
          <textarea
            name="description"
            value={getFieldValue("description")}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            placeholder="توضیحات محصول را وارد کنید"
            required
          ></textarea>
        </div>

        {/* انتخاب دسته‌بندی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی *</label>
          <select
            name="categoryId"
            value={initialData?.categoryId?._id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            required
          >
            <option value="">انتخاب دسته‌بندی</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        {/* انتخاب نوع */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع محصول *</label>
          <select
            name="defaultProductVariantId"
            value={fields.defaultProductVariantId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">انتخاب نوع</option>
            {difaultVar.map((dv) => (
              <option key={dv._id} value={dv._id}>{dv.price}</option>
            ))}
          </select>
        </div>


        {/* انتخاب برند */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">برند *</label>
          <select
            name="brandId"
            value={initialData?.brandId?._id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            required
          >
            <option value="">انتخاب برند</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* آپلود تصویر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="images">
            آپلود تصویر
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageUpload}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={uploading}
          />
          {images.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">تصاویر آپلود شده:</p>
              <div className="flex space-x-2 mt-1">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={import.meta.env.VITE_BASE_FILE + img}
                    alt={`تصویر ${idx}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* اطلاعات اضافی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اطلاعات تکمیلی</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="کلید"
              value={infoKey}
              onChange={(e) => setInfoKey(e.target.value)}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-right"
            />
            <input
              type="text"
              placeholder="مقدار"
              value={infoValue}
              onChange={(e) => setInfoValue(e.target.value)}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-right"
            />
            <button 
              type="button"
              onClick={handleAddInformation}
              className="px-3 py-2 bg-green-500 text-white rounded-md"
            >
              افزودن
            </button>
          </div>
          {information.length > 0 && (
            <ul className="list-disc pr-5">
              {information.map((info, idx) => (
                <li key={idx} className="text-sm text-gray-700 text-right">
                  {info.key}: {info.value}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "در حال به‌روزرسانی..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;