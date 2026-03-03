import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";

export default function NotificationBell() {
  const { t } = useTranslation();
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    if (state.user) {
      fetchNotifications();
      // Subscribe to realtime notifications
      const channel = supabase
        .channel("notifications")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
          if (payload.new.user_id === state.user.id || payload.new.user_id === null) {
            setNotifications((prev) => [payload.new, ...prev]);
            setUnreadCount((c) => c + 1);
          }
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [state.user?.id]);

  async function fetchNotifications() {
    // Fetch user-specific + global (user_id IS NULL) notifications
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.eq.${state.user.id},user_id.is.null`)
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error && data) {
      // Filter out notifications the user has cleared
      const clearedIds = JSON.parse(localStorage.getItem("forgeks-cleared-notifs") || "[]");
      const visible = data.filter((n) => !clearedIds.includes(n.id));
      setNotifications(visible);
      // Check read status from local storage
      const readIds = JSON.parse(localStorage.getItem("forgeks-read-notifs") || "[]");
      setUnreadCount(visible.filter((n) => !readIds.includes(n.id)).length);
    }
  }

  function markAllRead() {
    const ids = notifications.map((n) => n.id);
    localStorage.setItem("forgeks-read-notifs", JSON.stringify(ids));
    setUnreadCount(0);
  }

  function clearAll() {
    // Persist cleared IDs so they don't reappear after refresh
    const ids = notifications.map((n) => n.id);
    const existing = JSON.parse(localStorage.getItem("forgeks-cleared-notifs") || "[]");
    const merged = [...new Set([...existing, ...ids])];
    localStorage.setItem("forgeks-cleared-notifs", JSON.stringify(merged));
    // Also mark as read
    localStorage.setItem("forgeks-read-notifs", JSON.stringify(merged));
    setNotifications([]);
    setUnreadCount(0);
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const readIds = JSON.parse(localStorage.getItem("forgeks-read-notifs") || "[]");

  return (
    <div className="notification-wrapper" ref={ref}>
      <button
        className="icon-btn"
        onClick={() => {
          if (!state.user) return;
          const willOpen = !open;
          setOpen(willOpen);
          if (willOpen && unreadCount > 0) {
            markAllRead();
          }
        }}
        title={t("notifications")}
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notif-header">
            <h4>{t("notificationsTitle")}</h4>
            <div className="notif-header-actions">
              {unreadCount > 0 && (
                <button className="notif-action-btn" onClick={markAllRead}>
                  {t("markAllRead")}
                </button>
              )}
              {notifications.length > 0 && (
                <button className="notif-action-btn" onClick={clearAll}>
                  {t("clearAll")}
                </button>
              )}
            </div>
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <p className="notif-empty">{t("noNotifications")}</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${readIds.includes(n.id) ? "read" : "unread"}`}
                >
                  <div className="notif-item-header">
                    <span className={`notif-type ${n.type || "announcement"}`}>
                      {n.type === "order" ? t("orderUpdate") : t("announcement")}
                    </span>
                    <span className="notif-time">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="notif-title">{n.title}</p>
                  {n.message && <p className="notif-message">{n.message}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
