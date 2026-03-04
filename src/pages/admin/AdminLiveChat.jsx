import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  RefreshCw,
  User,
  Bot,
  Clock,
  CheckCircle,
  Circle,
  Loader,
  Search,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  open: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "Open" },
  in_progress: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "In Progress" },
  closed: { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Closed" },
};

function StatusDot({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.open;
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: s.color,
        marginRight: 5,
        flexShrink: 0,
      }}
    />
  );
}

export default function AdminLiveChat() {
  const [sessions, setSessions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);
  const channelRef = useRef(null);

  // Load sessions
  async function loadSessions() {
    setLoading(true);
    let q = supabase
      .from("chat_sessions")
      .select("*")
      .order("updated_at", { ascending: false, nullsFirst: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setSessions(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadSessions();
  }, [filter]);

  // Real-time new sessions
  useEffect(() => {
    const channel = supabase
      .channel("chat_sessions_admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_sessions" }, () => {
        loadSessions();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [filter]);

  // Load messages for selected session
  useEffect(() => {
    if (!selectedId) return;
    loadMessages(selectedId);

    // subscribe to new messages
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    const channel = supabase
      .channel(`admin_chat_${selectedId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `session_id=eq.${selectedId}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.find((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();
    channelRef.current = channel;

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [selectedId]);

  async function loadMessages(id) {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendReply(e) {
    e.preventDefault();
    if (!reply.trim() || !selectedId) return;
    setSending(true);
    const text = reply.trim();
    setReply("");

    const { data: newMsg, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: selectedId,
        sender: "admin",
        content: text,
      })
      .select()
      .single();

    // Optimistically add message to state so admin sees it immediately
    // (Supabase Realtime does not reliably fire postgres_changes for the
    //  same client that performed the INSERT, so we do it manually here)
    if (newMsg) {
      setMessages((prev) => {
        if (prev.find((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    }

    if (error) {
      toast.error("Failed to send message");
      setSending(false);
      return;
    }

    await supabase
      .from("chat_sessions")
      .update({ status: "in_progress", updated_at: new Date().toISOString() })
      .eq("id", selectedId);

    setSessions((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, status: "in_progress" } : s))
    );
    setSending(false);
  }

  async function closeSession(id) {
    const { error } = await supabase.from("chat_sessions").update({ status: "closed" }).eq("id", id);
    if (error) {
      toast.error("Failed to close chat");
      return;
    }
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "closed" } : s)));
    toast.success("Chat closed");
  }

  async function reopenSession(id) {
    const { error } = await supabase.from("chat_sessions").update({ status: "open" }).eq("id", id);
    if (error) {
      toast.error("Failed to reopen chat");
      return;
    }
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "open" } : s)));
    toast.success("Chat reopened");
  }

  const filteredSessions = sessions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (s.user_name || "").toLowerCase().includes(q) ||
      (s.user_email || "").toLowerCase().includes(q)
    );
  });

  const selected = sessions.find((s) => s.id === selectedId);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 100px)", gap: 0, background: "var(--bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 280, flexShrink: 0, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--bg-card)" }}>
        <div style={{ padding: "16px 16px 10px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <MessageCircle size={18} style={{ color: "var(--accent)" }} />
            <strong style={{ fontSize: "0.95rem" }}>Live Chats</strong>
            <button
              onClick={loadSessions}
              style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4, borderRadius: 4, display: "flex" }}
            >
              <RefreshCw size={14} />
            </button>
          </div>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "6px 10px", marginBottom: 8 }}>
            <Search size={13} style={{ color: "var(--text-dim)" }} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: "0.82rem", width: "100%" }}
            />
          </div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 4 }}>
            {["all", "open", "in_progress", "closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  flex: 1,
                  padding: "4px 0",
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: filter === f ? "var(--accent)" : "var(--border)",
                  background: filter === f ? "var(--accent)" : "transparent",
                  color: filter === f ? "#fff" : "var(--text-muted)",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  fontWeight: filter === f ? 600 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {f === "in_progress" ? "Active" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
              <Loader size={18} className="spin" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--text-dim)", fontSize: "0.85rem" }}>
              No sessions found
            </div>
          ) : (
            filteredSessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 16px",
                  background: selectedId === s.id ? "var(--bg-elevated)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  color: "var(--text)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  transition: "background 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <StatusDot status={s.status} />
                  <span style={{ fontWeight: 600, fontSize: "0.85rem", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.user_name || "Guest"}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                    {new Date(s.updated_at || s.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", paddingLeft: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.user_email || "No email"}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      {selectedId ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
          {/* Chat header */}
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, background: "var(--bg-card)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{selected?.user_name || "Guest"}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selected?.user_email || "No email"}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {selected?.status !== "closed" ? (
                <button
                  onClick={() => closeSession(selectedId)}
                  style={{ padding: "5px 14px", borderRadius: 999, border: "1px solid var(--border)", background: "transparent", color: "#10b981", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 5 }}
                >
                  <CheckCircle size={13} /> Close Chat
                </button>
              ) : (
                <button
                  onClick={() => reopenSession(selectedId)}
                  style={{ padding: "5px 14px", borderRadius: 999, border: "1px solid var(--border)", background: "transparent", color: "#f59e0b", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 5 }}
                >
                  <Circle size={13} /> Reopen
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}
                >
                  {!isUser && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: isBot ? "var(--bg-elevated)" : "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 }}>
                      {isBot ? <Bot size={13} style={{ color: "var(--text-muted)" }} /> : <User size={13} style={{ color: "#fff" }} />}
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "9px 14px",
                      borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: isUser ? "var(--accent)" : isBot ? "var(--bg-card)" : "#1a2e1a",
                      color: isUser ? "#fff" : "var(--text)",
                      fontSize: "0.88rem",
                      lineHeight: 1.5,
                      border: `1px solid ${isUser ? "transparent" : isBot ? "var(--border)" : "#2a4a2a"}`,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    }}
                  >
                    {!isUser && (
                      <div style={{ fontSize: "0.72rem", color: isBot ? "var(--accent)" : "#6aff8a", fontWeight: 600, marginBottom: 4 }}>
                        {isBot ? "🤖 Bot" : "👤 Support Agent"}
                      </div>
                    )}
                    <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</div>
                    <div style={{ fontSize: "0.68rem", color: isUser ? "rgba(255,255,255,0.6)" : "var(--text-dim)", marginTop: 4, textAlign: "right" }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Reply input */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}>
            {selected?.status === "closed" ? (
              <div style={{ textAlign: "center", color: "var(--text-dim)", fontSize: "0.85rem", padding: "8px 0" }}>
                This chat is closed. Reopen it to reply.
              </div>
            ) : (
              <form onSubmit={sendReply} style={{ display: "flex", gap: 8 }}>
                <textarea
                  rows={2}
                  placeholder="Type your reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) sendReply(e);
                  }}
                  style={{
                    flex: 1,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "8px 12px",
                    color: "var(--text)",
                    fontSize: "0.88rem",
                    resize: "none",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                  }}
                />
                <button
                  type="submit"
                  disabled={!reply.trim() || sending}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--accent)",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    opacity: !reply.trim() || sending ? 0.5 : 1,
                    alignSelf: "flex-end",
                  }}
                >
                  {sending ? <Loader size={15} className="spin" /> : <Send size={15} />}
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, color: "var(--text-muted)" }}>
          <MessageCircle size={48} strokeWidth={1} />
          <p style={{ fontSize: "0.95rem" }}>Select a chat to start replying</p>
        </div>
      )}
    </div>
  );
}
