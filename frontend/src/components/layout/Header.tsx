import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShoppingBag,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { logoutUser } from "../../store/authSlice";

const Header = () => {
  const [keyword, setKeyword] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, dispatch } = useAuth();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Entire header (top bar + logo/search/icons + mobile search + mobile
  // dropdown) is hidden below the md breakpoint — on phones the bottom
  // nav (BottomNav) + Account page handle navigation instead.
  return (
    <div className="hidden md:block">
      {/* Top Bar */}
      <div className="bg-orange-600 text-white text-xs">
        <div className="container flex justify-end gap-4 md:gap-6 py-1.5 px-4">
          {isAuthenticated ? (
            <>
              <span className="truncate max-w-[120px]">Hi, {user?.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-1 shrink-0">
                <FaSignOutAlt size={12} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
          <Link to="/orders">My Orders</Link>
          <span>Help</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-primary shadow-md sticky top-0 z-50">
        <div className="container flex items-center gap-3 md:gap-6 py-3 md:py-4 px-4">
          {/* Mobile menu toggle — kept in case md breakpoint is ever lowered */}
          <button
            className="lg:hidden text-white shrink-0"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* Logo — replace the icon below with an <img> tag pointing to your
              own logo file (e.g. src="/assets/logo.png") once you have one */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl md:text-3xl font-bold text-white shrink-0"
          >
            <FaShoppingBag className="text-white" size={22} />
            {/* <img src="/assets/logo.png" alt="Daraz logo" className="h-7 md:h-9 w-auto" /> */}
            DARAZ
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search in Daraz"
              className="w-full h-11 rounded-l-md px-4 outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-orange-200 px-5 rounded-r-md flex items-center justify-center shrink-0"
            >
              <FaSearch size={18} />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <Link to="/wishlist" className="relative text-white">
              <FaHeart size={20} className="md:w-[22px] md:h-[22px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-white">
              <FaShoppingCart size={20} className="md:w-[22px] md:h-[22px]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link to="/profile" className="text-white">
              <FaUser size={20} className="md:w-[22px] md:h-[22px]" />
            </Link>
          </div>
        </div>

        {/* Mobile dropdown menu — kept in case md breakpoint is ever lowered */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t px-4 py-3 space-y-3">
            {isAuthenticated ? (
              <>
                <p className="text-sm text-gray-600">Hi, {user?.name}</p>
                <Link
                  to="/profile"
                  className="block text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm py-1 text-red-600"
                >
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;