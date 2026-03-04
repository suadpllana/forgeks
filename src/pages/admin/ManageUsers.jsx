import { useState, useEffect } from "react";
import { ShieldOff, ShieldCheck, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  async function loadUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleBan(user) {
    setActionLoading(user.id);
    const newBanned = !user.is_banned;
    await supabase
      .from("profiles")
      .update({ is_banned: newBanned })
      .eq("id", user.id);
    await loadUsers();
    setActionLoading(null);
    toast.success(newBanned ? "User banned." : "User unbanned.");
  }

  async function setRole(userId, role) {
    setActionLoading(userId);
    await supabase.from("profiles").update({ role }).eq("id", userId);
    await loadUsers();
    setActionLoading(null);
    toast.success("Role updated to " + role);
  }

  if (loading)
    return <div className="admin-panel-loading">Loading users...</div>;

  return (
    <div className="manage-users">
      <div className="admin-header-row">
        <h2>Manage Users ({users.length})</h2>
        <button className="btn btn-outline btn-sm" onClick={loadUsers}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className={u.is_banned ? "row-banned" : ""}>
              <td className="mono">{String(u.id).slice(0, 8)}...</td>
              <td>{u.full_name || "—"}</td>
              <td>{u.email}</td>
              <td>
                <select
                  className="role-select"
                  value={u.role || "user"}
                  onChange={(e) => setRole(u.id, e.target.value)}
                  disabled={actionLoading === u.id}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                {u.is_banned ? (
                  <span className="badge-red">Banned</span>
                ) : (
                  <span className="badge-green">Active</span>
                )}
              </td>
              <td>
                {u.created_at
                  ? new Date(u.created_at).toLocaleDateString()
                  : "—"}
              </td>
              <td className="action-cell">
                <button
                  className={`btn btn-sm ${u.is_banned ? "btn-outline" : "btn-danger"}`}
                  onClick={() => toggleBan(u)}
                  disabled={actionLoading === u.id}
                  title={u.is_banned ? "Unban User" : "Ban User"}
                >
                  {u.is_banned ? (
                    <>
                      <ShieldCheck size={14} /> Unban
                    </>
                  ) : (
                    <>
                      <ShieldOff size={14} /> Ban
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="admin-muted" style={{ textAlign: "center", padding: 32 }}>
          No users found.
        </p>
      )}
    </div>
  );
}
