import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Brand = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6" style={{ direction: "rtl" }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت برندها</h1>
        <button
          onClick={() => navigate("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
        >
          + ایجاد برند جدید
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default Brand;