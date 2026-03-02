import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Gamepad2,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { t } = useTranslation();
  const { state, dispatch } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  const links = [
    { to: "/", label: t("home") },
    { to: "/games", label: t("allGames") },
    { to: "/gift-cards", label: t("giftCards") },
    { to: "/wishlist", label: t("wishlist") },
    { to: "/orders", label: t("myOrders") },
  ];

  function handleSearch(e) {
    dispatch({ type: "SET_SEARCH", payload: e.target.value });
    if (location.pathname !== "/games") navigate("/games");
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Gamepad2 size={28} />
          <span>Forge Ks</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links desktop-only">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className={`navbar-search ${searchFocused ? "focused" : ""}`}>
          <Search size={16} />
          <input
            ref={searchRef}
            type="text"
            placeholder={t("searchPlaceholder")}
            value={state.searchQuery}
            onChange={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Utilities */}
        <div className="navbar-utils">
          <LanguageSwitcher />
          {state.user && <NotificationBell />}
          <button
            className="icon-btn"
            onClick={() => navigate("/wishlist")}
            title={t("wishlist")}
          >
            <Heart size={20} />
            {state.wishlist.length > 0 && (
              <span className="badge">{state.wishlist.length}</span>
            )}
          </button>
          <button
            className="icon-btn"
            onClick={() => navigate("/cart")}
            title={t("cart")}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          {state.user ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className="sign-in-btn"
                onClick={() => setUserMenuOpen((o) => !o)}
              >
                <User size={16} />
                <span>{state.user.name}</span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-name">{state.user.name}</div>
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    {t("profile")}
                  </button>
                  <button
                    className="user-dropdown-item"
                    onClick={async () => {
                      setUserMenuOpen(false);
                      await supabase.auth.signOut();
                      dispatch({ type: "LOGOUT" });
                    }}
                  >
                    {t("signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="sign-in-btn"
              onClick={() =>
                dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" })
              }
            >
              <User size={16} />
              <span className="desktop-only">{t("signInRegister")}</span>
              <span className="mobile-only-inline">{t("signIn")}</span>
            </button>
          )}

          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`mobile-link ${location.pathname === l.to ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
