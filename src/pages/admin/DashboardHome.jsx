import { useState, useEffect } from "react";
import { Gamepad2, Users, ShoppingBag, DollarSign } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [gamesRes, ordersRes, usersRes] = await Promise.all([
        supabase.from("games").select("id", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true }),
      ]);

      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce(
        (s, o) => s + Number(o.total || 0),
        0
      );

      // Get total revenue from ALL orders
      const { data: allOrders } = await supabase
        .from("orders")
        .select("total");
      const fullRevenue = (allOrders || []).reduce(
        (s, o) => s + Number(o.total || 0),
        0
      );

      setStats({
        totalGames: gamesRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalOrders: (allOrders || []).length,
        totalRevenue: fullRevenue,
      });
      setRecentOrders(orders);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return <div className="admin-panel-loading">Loading stats...</div>;

  return (
    <div className="dashboard-home">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon games">
            <Gamepad2 size={24} />
          </div>
          <div>
            <span className="stat-value">{stats.totalGames}</span>
            <span className="stat-label">Total Games</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div>
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Registered Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orders">
            <ShoppingBag size={24} />
          </div>
          <div>
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="stat-value">
              ${stats.totalRevenue.toFixed(2)}
            </span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h3>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="admin-muted">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total</th>
                <th>Items</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="mono">{String(o.id).slice(0, 8)}...</td>
                  <td className="mono">{o.user_id ? String(o.user_id).slice(0, 8) : "—"}...</td>
                  <td>${Number(o.total).toFixed(2)}</td>
                  <td>{(o.items || []).length} items</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
