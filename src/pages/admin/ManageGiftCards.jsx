import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const EMPTY_CARD = { title: "", price: 0, platform: "", image: "" };

export default function ManageGiftCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_CARD);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadCards() {
    setLoading(true);
    const { data } = await supabase
      .from("gift_cards")
      .select("*")
      .order("id", { ascending: true });
    setCards(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCards();
  }, []);

  function startNew() {
    setEditing("new");
    setForm(EMPTY_CARD);
    setError("");
  }

  function startEdit(card) {
    setEditing(card.id);
    setForm({ ...card });
    setError("");
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_CARD);
    setError("");
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    const record = {
      title: form.title,
      price: Number(form.price),
      platform: form.platform,
      image: form.image,
    };
    try {
      if (editing === "new") {
        const { error: e } = await supabase.from("gift_cards").insert(record);
        if (e) throw e;
      } else {
        const { error: e } = await supabase
          .from("gift_cards")
          .update(record)
          .eq("id", editing);
        if (e) throw e;
      }
      cancelEdit();
      await loadCards();
      toast.success(editing === "new" ? "Gift card added!" : "Gift card updated!");
    } catch (e) {
      setError(e.message);
      toast.error("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this gift card?")) return;
    await supabase.from("gift_cards").delete().eq("id", id);
    await loadCards();
    toast.success("Gift card deleted.");
  }

  if (loading)
    return <div className="admin-panel-loading">Loading gift cards...</div>;

  return (
    <div className="manage-giftcards">
      <div className="admin-header-row">
        <h2>Manage Gift Cards ({cards.length})</h2>
        {editing === null && (
          <button className="btn btn-primary btn-sm" onClick={startNew}>
            <Plus size={16} /> Add Gift Card
          </button>
        )}
      </div>

      {editing !== null && (
        <div className="admin-editor">
          <h3>{editing === "new" ? "Add Gift Card" : "Edit Gift Card"}</h3>
          {error && <div className="admin-error">{error}</div>}
          <div className="editor-grid">
            <div className="editor-field">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Steam Wallet $50"
              />
            </div>
            <div className="editor-field">
              <label>Price *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="editor-field">
              <label>Platform</label>
              <input
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                placeholder="PC / PS5"
              />
            </div>
            <div className="editor-field">
              <label>Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
          </div>
          <div className="editor-actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} /> {saving ? "Saving..." : "Save"}
            </button>
            <button className="btn btn-outline" onClick={cancelEdit}>
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Platform</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>${Number(c.price).toFixed(2)}</td>
              <td>{c.platform}</td>
              <td className="action-cell">
                <button
                  className="icon-btn-sm"
                  title="Edit"
                  onClick={() => startEdit(c)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="icon-btn-sm danger"
                  title="Delete"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
