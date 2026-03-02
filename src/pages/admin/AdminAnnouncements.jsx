import { useState, useEffect } from "react";
import { Megaphone, Send, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("type", "announcement")
      .is("user_id", null)
      .order("created_at", { ascending: false });
    setAnnouncements(data || []);
    setLoading(false);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSending(true);
    setFeedback("");

    const { error } = await supabase.from("notifications").insert({
      user_id: null, // null = broadcast to all users
      type: "announcement",
      title: title.trim(),
      message: message.trim() || null,
    });

    if (error) {
      setFeedback("Failed: " + error.message);
    } else {
      setFeedback("Announcement sent to all users!");
      setTitle("");
      setMessage("");
      fetchAnnouncements();
    }
    setSending(false);
  }

  async function handleDelete(id) {
    await supabase.from("notifications").delete().eq("id", id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="admin-announcements">
      <h2>
        <Megaphone size={22} /> Announcements
      </h2>

      <div className="announcement-form-card">
        <h3>Create Announcement</h3>
        <form onSubmit={handleSend}>
          <div className="editor-field">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title..."
              required
            />
          </div>
          <div className="editor-field" style={{ marginTop: 12 }}>
            <label>Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Additional details..."
              rows={3}
            />
          </div>
          {feedback && (
            <p
              className="review-msg"
              style={{
                marginTop: 12,
                color: feedback.startsWith("Failed") ? "var(--red)" : "var(--green)",
                background: feedback.startsWith("Failed")
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(16,185,129,0.1)",
              }}
            >
              {feedback}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={sending}
            style={{ marginTop: 16 }}
          >
            <Send size={16} />
            {sending ? "Sending..." : "Send Announcement"}
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h3>Previous Announcements</h3>
        {loading ? (
          <p className="admin-muted">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="admin-muted">No announcements yet.</p>
        ) : (
          <div className="announcements-list">
            {announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <div className="announcement-card-header">
                  <div>
                    <h4>{a.title}</h4>
                    <span className="announcement-date">
                      {new Date(a.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <button
                    className="icon-btn-sm danger"
                    onClick={() => handleDelete(a.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {a.message && <p className="announcement-message">{a.message}</p>}
                <span className="announcement-badge">Sent to all users</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
