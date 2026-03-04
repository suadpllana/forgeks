import { useState, useEffect } from "react";
import { Eye, EyeOff, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState({});

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    const orderList = data || [];
    setOrders(orderList);

    // Fetch profile info for all unique user IDs
    const userIds = [...new Set(orderList.map((o) => o.user_id).filter(Boolean))];
    if (userIds.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      if (profileData) {
        const map = {};
        profileData.forEach((p) => { map[p.id] = p; });
        setProfiles(map);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function toggleKey(orderId) {
    setVisibleKeys((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  }

  if (loading)
    return <div className="admin-panel-loading">Loading orders...</div>;

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const pendingCrypto = orders.filter((o) => o.status === "pending_crypto");

  async function handleApproveCrypto(order) {
    // Generate keys on approval
    const keys = (order.items || []).map((i) => ({
      game: i.title,
      key: `XXXX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    }));
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed", keys })
      .eq("id", order.id);
    if (error) { toast.error("Error approving: " + error.message); return; }
    // Notify user
    await supabase.from("notifications").insert({
      user_id: order.user_id,
      type: "order",
      title: "Crypto Payment Confirmed!",
      message: `Your crypto payment of $${Number(order.total).toFixed(2)} has been verified. Your game keys are now available in My Orders.`,
    });
    toast.success("Order approved — keys delivered!");
    loadOrders();
  }

  async function handleRejectCrypto(order) {
    if (!confirm("Reject this crypto order? The user will be notified.")) return;
    const { error } = await supabase
      .from("orders")
      .update({ status: "rejected" })
      .eq("id", order.id);
    if (error) { toast.error("Error rejecting: " + error.message); return; }
    await supabase.from("notifications").insert({
      user_id: order.user_id,
      type: "order",
      title: "Crypto Payment Not Received",
      message: `Your crypto order of $${Number(order.total).toFixed(2)} could not be verified. If you believe this is an error, please contact support.`,
    });
    toast.success("Order rejected — user notified.");
    loadOrders();
  }

  return (
    <div className="manage-orders">
      <div className="admin-header-row">
        <h2>
          All Orders ({orders.length})
          <span className="admin-revenue-badge">
            Revenue: ${totalRevenue.toFixed(2)}
          </span>
        </h2>
        <button className="btn btn-outline btn-sm" onClick={loadOrders}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Pending crypto orders banner */}
      {pendingCrypto.length > 0 && (
        <div className="admin-pending-banner">
          <Clock size={18} />
          <strong>{pendingCrypto.length} crypto order{pendingCrypto.length > 1 ? "s" : ""} awaiting verification</strong>
          <span>— Check your wallet and approve or reject below.</span>
        </div>
      )}

      {orders.length === 0 ? (
        <p className="admin-muted" style={{ textAlign: "center", padding: 32 }}>
          No orders yet.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Keys</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const profile = profiles[o.user_id];
              return (
                <tr key={o.id}>
                  <td className="mono">{String(o.id).slice(0, 8)}…</td>
                  <td>{profile?.full_name || <span className="admin-muted">—</span>}</td>
                  <td className="mono" style={{ fontSize: "0.8rem" }}>
                    {profile?.email || (o.user_id ? String(o.user_id).slice(0, 8) + "…" : "—")}
                  </td>
                  <td>
                    {(o.items || []).map((i, idx) => (
                      <div key={idx} className="order-item-line">
                        {i.title} x{i.qty}
                      </div>
                    ))}
                  </td>
                  <td className="fw-bold">${Number(o.total).toFixed(2)}</td>
                  <td>
                    {o.status === "pending_crypto" ? (
                      <div className="admin-crypto-actions">
                        <span className="status-badge pending"><Clock size={12} /> Pending</span>
                        {o.crypto_details && (
                          <span className="status-badge crypto-info">{o.crypto_details.crypto} · {o.crypto_details.network}</span>
                        )}
                        <button className="btn btn-sm btn-success" onClick={() => handleApproveCrypto(o)}>
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleRejectCrypto(o)}>
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : o.status === "rejected" ? (
                      <span className="status-badge rejected"><XCircle size={12} /> Rejected</span>
                    ) : (
                      <span className="status-badge completed"><CheckCircle size={12} /> Completed</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => toggleKey(o.id)}
                    >
                      {visibleKeys[o.id] ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {visibleKeys[o.id] ? " Hide" : " Show"}
                    </button>
                    {visibleKeys[o.id] && (
                      <div className="keys-list">
                        {(o.keys || []).map((k, idx) => (
                          <div key={idx} className="key-line">
                            <span>{k.game}:</span>
                            <code>{k.key}</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
