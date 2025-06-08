import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Address = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto  px-4 py-6" style={{ direction: "rtl" }}>
      <div className="flex justify-start mb-4 ">
        <button
          onClick={() => navigate("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          ایجاد آدرس جدید
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default Address;
