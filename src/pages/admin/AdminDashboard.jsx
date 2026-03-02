import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gamepad2,
  Users,
  ShoppingBag,
  Gift,
  LayoutDashboard,
  LogOut,
  BarChart3,
  TrendingUp,
  Megaphone,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import ManageGames from "./ManageGames";
import ManageUsers from "./ManageUsers";
import ManageOrders from "./ManageOrders";
import ManageGiftCards from "./ManageGiftCards";
import DashboardHome from "./DashboardHome";
import AdminAnalytics from "./AdminAnalytics";
import AdminAnnouncements from "./AdminAnnouncements";
import AdminSupportMessages from "./AdminSupportMessages";

const TABS = [
  { id: "home", label: "Dashboard", icon: BarChart3 },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "users", label: "Users", icon: Users },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "giftcards", label: "Gift Cards", icon: Gift },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "support", label: "Support", icon: MessageSquare },
  { id: "store", label: "Store", icon: LayoutDashboard },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("home");
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [openMsgCount, setOpenMsgCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/admin");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, email")
        .eq("id", session.user.id)
        .single();
      if (profile?.role !== "admin") {
        navigate("/admin");
        return;
      }
      setAdmin({ id: session.user.id, ...profile });
      setChecking(false);
      // Fetch open support message count
      const { count } = await supabase
        .from("support_messages")
        .select("id", { count: "exact", head: true })
        .eq("status", "open");
      setOpenMsgCount(count || 0);
    }
    checkAdmin();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin");
  }

  if (checking)
    return (
      <div className="admin-loading">
        <LayoutDashboard size={32} />
        <p>Loading admin panel...</p>
      </div>
    );

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Gamepad2 size={24} />
          <span>Forge Ks</span>
          <span className="admin-badge-sm">ADMIN</span>
        </div>

        <nav className="admin-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-nav-item ${tab === t.id ? "active" : ""}`}
              onClick={() => {
                if (t.id === "store") {
                  window.open("/", "_blank");
                } else {
                  if (t.id === "support") setOpenMsgCount(0);
                  setTab(t.id);
                }
              }}
            >
              <t.icon size={18} />
              {t.label}
              {t.id === "support" && openMsgCount > 0 && (
                <span style={{ marginLeft: "auto", background: "var(--red)", color: "#fff", borderRadius: 999, padding: "1px 7px", fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.6 }}>
                  {openMsgCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-name">
              {admin?.full_name || admin?.email}
            </span>
            <span className="admin-user-role">Administrator</span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {tab === "home" && <DashboardHome />}
        {tab === "games" && <ManageGames />}
        {tab === "users" && <ManageUsers />}
        {tab === "orders" && <ManageOrders />}
        {tab === "giftcards" && <ManageGiftCards />}
        {tab === "analytics" && <AdminAnalytics />}
        {tab === "announcements" && <AdminAnnouncements />}
        {tab === "support" && <AdminSupportMessages />}
      </main>
    </div>
  );
}
