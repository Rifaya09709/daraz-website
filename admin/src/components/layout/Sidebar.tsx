import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingBag,
  FaTags,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../../hooks/useAuth";
import { logoutAdmin } from "../../store/authSlice";
import { useChatNotifications } from "../../context/ChatNotificationContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: <FaTachometerAlt size={18} />, end: true },
  { to: "/products", label: "Products", icon: <FaBoxOpen size={18} /> },
  { to: "/orders", label: "Orders", icon: <FaShoppingBag size={18} /> },
  { to: "/coupons", label: "Coupons", icon: <FaTags size={18} /> },
  { to: "/chats", label: "Chats", icon: <FaComments size={18} /> },
];

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadTotal } = useChatNotifications();

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-gray-300 flex flex-col">
      <div className="px-6 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">
          DARAZ <span className="text-primary">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </span>

            {item.to === "/chats" && unreadTotal > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {unreadTotal > 99 ? "99+" : unreadTotal}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-gray-800">
        <p className="text-xs text-gray-500 px-2 mb-3">
          Logged in as <span className="text-gray-300">{user?.name}</span>
        </p>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition text-sm font-medium"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;