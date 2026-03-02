import { useState, useEffect } from "react";
import { MessageSquare, Mail, Clock, CheckCircle, AlertCircle, Loader, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";

const STATUS_OPTIONS = ["open", "in_progress", "resolved"];

const STATUS_STYLES = {
  open: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "Open" },
  in_progress: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "In Progress" },
  resolved: { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Resolved" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.open;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

export default function AdminSupportMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [notesDraft, setNotesDraft] = useState({});

  async function load() {
    setLoading(true);
    let query = supabase
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data, error } = await query;
    if (!error) setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function updateStatus(id, status) {
    setSavingId(id);
    await supabase.from("support_messages").update({ status }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    setSavingId(null);
  }

  async function saveNotes(id) {
    setSavingId(id);
    const notes = notesDraft[id] ?? messages.find((m) => m.id === id)?.admin_notes ?? "";
    await supabase.from("support_messages").update({ admin_notes: notes }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, admin_notes: notes } : m)));
    setSavingId(null);
  }

  function toggleExpand(id) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  const counts = {
    all: messages.length,
    open: messages.filter((m) => m.status === "open").length,
    in_progress: messages.filter((m) => m.status === "in_progress").length,
    resolved: messages.filter((m) => m.status === "resolved").length,
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2><MessageSquare size={22} style={{ verticalAlign: "middle", marginRight: 8 }} />Support Messages</h2>
        <button className="btn btn-outline btn-sm" onClick={load} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["all", "All"], ["open", "Open"], ["in_progress", "In Progress"], ["resolved", "Resolved"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: "1px solid",
              borderColor: filter === val ? "var(--accent)" : "var(--border)",
              background: filter === val ? "var(--accent)" : "var(--bg-card)",
              color: filter === val ? "#fff" : "var(--text-muted)",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontWeight: filter === val ? 600 : 400,
            }}
          >
            {label}
            {counts[val] > 0 && (
              <span style={{ marginLeft: 6, background: filter === val ? "rgba(255,255,255,0.25)" : "var(--bg-elevated)", borderRadius: 999, padding: "1px 7px", fontSize: "0.75rem" }}>
                {counts[val]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-panel-loading"><Loader size={24} className="spin" /> Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="admin-empty">
          <CheckCircle size={40} />
          <p>No {filter !== "all" ? filter.replace("_", " ") : ""} messages.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {messages.map((msg) => {
            const isOpen = expanded === msg.id;
            return (
              <div
                key={msg.id}
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                {/* Row header */}
                <button
                  onClick={() => toggleExpand(msg.id)}
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 20px",
                    background: "none",
                    border: "none",
                    color: "var(--text)",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {msg.name} &middot; <a href={`mailto:${msg.email}`} onClick={(e) => e.stopPropagation()} style={{ color: "var(--accent)" }}>{msg.email}</a>
                    </div>
                  </div>
                  <StatusBadge status={msg.status} />
                  <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                    {new Date(msg.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--border)" }}>
                    {/* Message body */}
                    <div style={{ margin: "16px 0", padding: 16, background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                      {msg.message}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {/* Status update */}
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6, fontWeight: 500 }}>
                          Status
                        </label>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(msg.id, s)}
                              disabled={savingId === msg.id}
                              style={{
                                padding: "5px 12px",
                                borderRadius: 999,
                                border: "1px solid",
                                borderColor: msg.status === s ? STATUS_STYLES[s].color : "var(--border)",
                                background: msg.status === s ? STATUS_STYLES[s].bg : "transparent",
                                color: msg.status === s ? STATUS_STYLES[s].color : "var(--text-muted)",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                fontWeight: msg.status === s ? 600 : 400,
                              }}
                            >
                              {STATUS_STYLES[s].label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick reply */}
                      <div style={{ textAlign: "right" }}>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="btn btn-primary btn-sm"
                          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                        >
                          <Mail size={14} /> Reply via Email
                        </a>
                      </div>
                    </div>

                    {/* Admin notes */}
                    <div style={{ marginTop: 16 }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6, fontWeight: 500 }}>
                        Internal Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Add internal notes (not visible to user)…"
                        value={notesDraft[msg.id] ?? msg.admin_notes ?? ""}
                        onChange={(e) => setNotesDraft((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                        style={{ width: "100%", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text)", fontSize: "0.85rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                      />
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: 8 }}
                        onClick={() => saveNotes(msg.id)}
                        disabled={savingId === msg.id}
                      >
                        {savingId === msg.id ? "Saving…" : "Save Notes"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
