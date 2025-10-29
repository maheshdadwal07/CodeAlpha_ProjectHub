import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/redux/slices/authSlice";
import { FiLogOut, FiUser, FiFolder } from "react-icons/fi";
import { useState } from "react";
import NotificationPanel from "@/components/common/NotificationPanel";

const Navbar = ({ hideUserInfo = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav
      className={`${
        hideUserInfo
          ? "bg-transparent"
          : "bg-white shadow-lg border-b border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to={hideUserInfo ? "/" : "/dashboard"}
            className="flex items-center space-x-2 group"
          >
            <div
              className={`p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow ${
                hideUserInfo
                  ? "bg-white/10 backdrop-blur-sm border border-white/20"
                  : "bg-gradient-to-br from-primary-500 to-primary-700"
              }`}
            >
              <FiFolder
                className={`w-6 h-6 ${
                  hideUserInfo ? "text-white" : "text-white"
                }`}
              />
            </div>
            <span
              className={`text-2xl font-bold ${
                hideUserInfo
                  ? "text-white drop-shadow-lg"
                  : "bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
              }`}
            >
              ProjectHub
            </span>
          </Link>

          {!hideUserInfo && user && (
            <div className="flex items-center space-x-4">
              <NotificationPanel />

              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-1.5 bg-primary-100 rounded-full">
                  <FiUser className="text-primary-600 w-4 h-4" />
                </div>
                <span className="text-gray-700 font-semibold">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200 shadow-sm hover:shadow"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
