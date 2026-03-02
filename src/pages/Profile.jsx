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
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (state.user) {
      setForm({ name: state.user.name || "" });
      fetchProfile();
    }
  }, [state.user?.id]);

  async function fetchProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", state.user.id)
      .single();
    if (data) setProfile(data);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      // Update auth metadata
      await supabase.auth.updateUser({
        data: { full_name: form.name },
      });
      // Update profiles table
      await supabase
        .from("profiles")
        .update({ full_name: form.name })
        .eq("id", state.user.id);

      dispatch({
        type: "SET_USER",
        payload: { ...state.user, name: form.name },
      });
      setMessage(t("profileUpdated"));
      setEditing(false);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
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
            <UserIcon size={48} />
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
                    setForm({ name: state.user.name });
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
              <span className="stat-value">${totalSpent.toFixed(2)}</span>
              <span className="stat-label">{t("totalSpent")}</span>
            </div>
          </div>
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
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <div className="order-items">
                  {order.keys?.map((k, idx) => (
                    <div key={idx} className="order-key-row">
                      <span className="order-game-name">{k.game}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
