import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Comments() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6" style={{ direction: "rtl" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">نظرات کاربران</h1>
      </div>
      <Outlet />
    </div>
  );
}