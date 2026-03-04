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
  Home,
  Layers,
  Gift,
  Clock,
  LogOut,
  UserCircle,
  LogIn,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";
import CurrencySelector from "./CurrencySelector";

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
    { to: "/", label: t("home"), icon: Home },
    { to: "/games", label: t("allGames"), icon: Layers },
    { to: "/gift-cards", label: t("giftCards"), icon: Gift },
    { to: "/wishlist", label: t("wishlist"), icon: Heart },
    { to: "/orders", label: t("myOrders"), icon: Clock },
  ];

  function handleSearch(e) {
    dispatch({ type: "SET_SEARCH", payload: e.target.value });
    if (location.pathname !== "/games") navigate("/games");
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Gamepad2 size={28} />
            <span>ForgeKs</span>
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

          {/* Utilities (desktop only) */}
          <div className="navbar-utils desktop-only">
            <CurrencySelector />
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
                <span>{t("signInRegister")}</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile sidebar overlay — outside nav to avoid stacking context issues */}
      <div
        className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile sidebar */}
      <aside className={`mobile-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Sidebar header */}
        <div className="mobile-sidebar-header">
          <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
            <Gamepad2 size={24} />
            <span>ForgeKs</span>
          </Link>
          <button className="icon-btn" onClick={() => setMobileOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="mobile-sidebar-nav">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`mobile-nav-link ${location.pathname === l.to ? "active" : ""}`}
              >
                <Icon size={18} />
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer: user info */}
        <div className="mobile-sidebar-footer">
          {state.user ? (
            <>
              <div className="mobile-sidebar-user">
                <div className="mobile-sidebar-avatar">
                  <User size={20} />
                </div>
                <div className="mobile-sidebar-user-info">
                  <span className="mobile-sidebar-name">{state.user.name}</span>
                  <span className="mobile-sidebar-email">{state.user.email}</span>
                </div>
              </div>
              <div className="mobile-sidebar-user-actions">
                <button
                  className="mobile-nav-link"
                  onClick={() => { setMobileOpen(false); navigate("/profile"); }}
                >
                  <UserCircle size={18} />
                  {t("profile")}
                </button>
                <button
                  className="mobile-nav-link"
                  onClick={async () => {
                    setMobileOpen(false);
                    await supabase.auth.signOut();
                    dispatch({ type: "LOGOUT" });
                  }}
                >
                  <LogOut size={18} />
                  {t("signOut")}
                </button>
              </div>
            </>
          ) : (
            <button
              className="mobile-sidebar-signin btn btn-primary full-width"
              onClick={() => {
                setMobileOpen(false);
                dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" });
              }}
            >
              <LogIn size={18} />
              {t("signInRegister")}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
