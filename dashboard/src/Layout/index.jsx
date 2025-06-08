import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Store/Slices/AuthSlice";
import { useState } from "react";
import {
  FiHome,
  FiList,
  FiPlus,
  FiEdit,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiServer,
  FiUser,
  FiMap,
  FiSliders,
  FiCodesandbox,
  FiCodepen,
  FiBox,
  FiPercent,
  FiMessageSquare,
  FiShoppingCart,
} from "react-icons/fi";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col mx-auto md:flex-row" style={{ direction: "rtl" }}>
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2  hover:bg-gray-100 rounded-lg"
        >
          {mobileMenuOpen ? (
            <FiChevronRight className="mr-[50px]" size={20} />
          
          ) : (
              <FiChevronLeft  size={20} />
          )}
        </button>
        <h1 className="text-lg font-semibold  text-gray-800">پنل مدیریت</h1>
      </header>

      {/* نوار کناری جمع شونده */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block ${
          isCollapsed ? "w-16" : "w-56 md:w-64"
        } bg-white shadow-lg p-4 transition-all  duration-500 flex flex-col fixed md:static h-full z-10`}
      >
        <div className="flex-1">
          {/* دکمه جمع کردن/باز کردن */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full mb-6 p-2 hover:bg-gray-100 rounded-lg items-center justify-center"
          >
            {isCollapsed ? (
              <FiChevronLeft size={24} />
            ) : (
              <FiChevronRight size={24} />
            )}
          </button>

          {/* عنوان نوار کناری */}
          <div
            className={`text-xl md:text-2xl font-bold text-gray-800 mb-8 ${
              isCollapsed ? "text-center" : "px-2"
            }`}
          >
            {isCollapsed ? "⚡" : "پنل مدیریت"}
          </div>

          {/* منوی ناوبری */}
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiHome className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    پیشخوان
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/slider"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiSliders className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    اسلایدرها
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/category"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiList className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    دسته‌بندی‌ها
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/brand"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiServer className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    برندها
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/user"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    کاربران
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/address"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiMap className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    آدرس‌ها
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/product"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiBox className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    محصولات
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/variant"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiCodepen className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    انواع محصول
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/product-variant"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiCodesandbox className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    تنوع محصولات
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/discount-code"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiPercent className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    کدهای تخفیف
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/comments"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiMessageSquare className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    نظرات
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/order"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiShoppingCart className="flex-shrink-0" size={20} />
                  <span
                    className={`mr-3 ${
                      isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
                    }`}
                  >
                    سفارشات
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* دکمه خروج */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <FiLogOut className="flex-shrink-0" size={20} />
          <span
            className={`mr-3 ${
              isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100"
            }`}
          >
            خروج
          </span>
        </button>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 p-4 md:p-8">
        {/* هدر دسکتاپ */}
        <header className="hidden md:block  bg-white shadow-sm p-4 mb-6 rounded-lg">
          <h1 className="text-xl font-semibold text-gray-800">
            خوش آمدید، مدیر
          </h1>
        </header>

        {/* محفظه محتوا */}
        <div className="bg-white  shadow-sm rounded-lg p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;