import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useSelector } from "react-redux";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate, useParams } from "react-router-dom";

const Reply = () => {
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [fields, handleChange] = useFormFields({ reply: "" }); // مقدار اولیه reply
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.warn("No token found. Cannot fetch comment.");
      setError("دسترسی غیرمجاز.");
      return;
    }

    (async () => {
      try {
        const response = await fetchData(`comment/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log("response from comment fetch:", response);

        if (response?.success) {
          setComment(response.data);
        } else {
          setError("خطا در دریافت اطلاعات کامنت.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("خطا در ارتباط با سرور.");
      }
    })();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetchData(`comment/reply/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      console.log("reply response:", response);

      if (response.success) {
        notify("پاسخ با موفقیت ثبت شد", "success");
        navigate("/comments");
      } else {
        notify(response.message || "خطا در ارسال پاسخ", "error");
      }
    } catch (err) {
      console.error("Reply error:", err);
      setError("خطا در ارسال پاسخ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">پاسخ به کامنت</h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">{error}</div>
      )}

      {comment ? (
        <>
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p className="text-gray-700 font-medium">متن کامنت:</p>
            <p className="text-gray-800">{comment.content}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                پاسخ شما <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reply"
                rows="4"
                onChange={handleChange}
                value={fields.reply}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="پاسخ خود را وارد کنید..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? "در حال ارسال..." : "ارسال پاسخ"}
            </button>
          </form>
        </>
      ) : !error ? (
        <p className="text-center text-gray-600">در حال دریافت اطلاعات...</p>
      ) : null}
    </div>
  );
};

export default Reply;
