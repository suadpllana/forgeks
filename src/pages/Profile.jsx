import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Package,
  DollarSign,
  Edit3,
  Save,
  X,
  Bell,
  BellOff,
  Camera,
  ShoppingBag,
} from "lucide-react";
import { useStore, useFormatPrice } from "../context/StoreContext";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const { state, dispatch } = useStore();
  const formatPrice = useFormatPrice();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [emailNotif, setEmailNotif] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (state.user) {
      setForm({ name: state.user.name || "", avatarUrl: state.user.avatar_url || "" });
      fetchProfile();
    }
  }, [state.user?.id]);

  async function fetchProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", state.user.id)
      .single();
    if (data) {
      setProfile(data);
      setEmailNotif(data.email_notifications ?? false);
      if (data.avatar_url) setForm((f) => ({ ...f, avatarUrl: data.avatar_url }));
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await supabase.auth.updateUser({
        data: { full_name: form.name },
      });
      await supabase
        .from("profiles")
        .update({ full_name: form.name, avatar_url: form.avatarUrl })
        .eq("id", state.user.id);

      dispatch({
        type: "SET_USER",
        payload: { ...state.user, name: form.name, avatar_url: form.avatarUrl },
      });
      setMessage(t("profileUpdated"));
      setEditing(false);
      setAvatarError(false);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEmailNotifToggle() {
    const newVal = !emailNotif;
    setEmailNotif(newVal);
    setNotifSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ email_notifications: newVal })
        .eq("id", state.user.id);
      if (error) {
        // Column may not exist yet — silently revert
        setEmailNotif(!newVal);
      }
    } finally {
      setNotifSaving(false);
    }
  }

  if (!state.user) {
    return (
      <div className="empty-page">
        <UserIcon size={64} strokeWidth={1} />
        <h2>{t("signIn")}</h2>
        <p>{t("signInAccess")}</p>
        <button
          className="btn btn-primary"
          onClick={() =>
            dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" })
          }
        >
          {t("signIn")}
        </button>
      </div>
    );
  }

  const totalSpent = state.orders.reduce((s, o) => s + (o.total || 0), 0);
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="profile-page">
      <h1>{t("myProfile")}</h1>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">
            {!avatarError && (state.user.avatar_url || form.avatarUrl) ? (
              <img
                src={state.user.avatar_url || form.avatarUrl}
                alt="Avatar"
                onError={() => setAvatarError(true)}
                style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)" }}>
                  {(state.user.name || state.user.email || "?")[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {editing ? (
            <div className="profile-edit-form">
              <div className="form-group">
                <UserIcon size={16} />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("fullNamePlaceholder")}
                />
              </div>
              <div className="form-group">
                <Camera size={16} />
                <input
                  type="url"
                  value={form.avatarUrl}
                  onChange={(e) => { setForm({ ...form, avatarUrl: e.target.value }); setAvatarError(false); }}
                  placeholder="Avatar image URL (optional)"
                />
              </div>
              <div className="profile-edit-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={14} />
                  {saving ? t("saving") : t("saveChanges")}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setEditing(false);
                    setForm({ name: state.user.name, avatarUrl: state.user.avatar_url || "" });
                  }}
                >
                  <X size={14} /> {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <h2>{state.user.name}</h2>
              <div className="profile-detail">
                <Mail size={16} />
                <span>{state.user.email}</span>
              </div>
              <div className="profile-detail">
                <Calendar size={16} />
                <span>
                  {t("memberSince")}: {memberSince}
                </span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setEditing(true)}
              >
                <Edit3 size={14} /> {t("editProfile")}
              </button>
            </div>
          )}

          {message && <p className="profile-message">{message}</p>}
        </div>

        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <Package size={24} />
            <div>
              <span className="stat-value">{state.orders.length}</span>
              <span className="stat-label">{t("totalOrders")}</span>
            </div>
          </div>
          <div className="profile-stat-card">
            <DollarSign size={24} />
            <div>
              <span className="stat-value">{formatPrice(totalSpent)}</span>
              <span className="stat-label">{t("totalSpent")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="profile-notif-section">
        <div className="profile-notif-card">
          <div className="profile-notif-info">
            <div className="profile-notif-icon">
              {emailNotif ? <Bell size={22} /> : <BellOff size={22} />}
            </div>
            <div>
              <h3>{t("emailNotifications")}</h3>
              <p>{t("emailNotificationsDesc")}</p>
            </div>
          </div>
          <button
            className={`toggle-btn ${emailNotif ? "on" : "off"}`}
            onClick={handleEmailNotifToggle}
            disabled={notifSaving}
            aria-label="Toggle email notifications"
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      {state.orders.length > 0 && (
        <div className="profile-orders-section">
          <div className="section-header">
            <h2>{t("orderHistory")}</h2>
            <Link to="/orders" className="see-all">
              {t("seeAll")} →
            </Link>
          </div>
          <div className="orders-list">
            {state.orders.slice(0, 3).map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="order-total">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className="order-items">
                  {order.keys && order.keys.length > 0
                    ? order.keys.map((k, idx) => (
                        <div key={idx} className="order-key-row">
                          <span className="order-game-name">{k.game}</span>
                        </div>
                      ))
                    : order.items && order.items.length > 0
                    ? order.items.map((item, idx) => (
                        <div key={idx} className="order-key-row">
                          <span className="order-game-name">{item.title}</span>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
