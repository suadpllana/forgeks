import { useState, useEffect } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState({});

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
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

      {orders.length === 0 ? (
        <p className="admin-muted" style={{ textAlign: "center", padding: 32 }}>
          No orders yet.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Items</th>
              <th>Total</th>
              <th>Keys</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="mono">{String(o.id).slice(0, 8)}...</td>
                <td className="mono">{o.user_id ? String(o.user_id).slice(0, 8) : "—"}...</td>
                <td>
                  {(o.items || []).map((i, idx) => (
                    <div key={idx} className="order-item-line">
                      {i.title} x{i.qty}
                    </div>
                  ))}
                </td>
                <td className="fw-bold">${Number(o.total).toFixed(2)}</td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
