import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

const EMPTY_GAME = {
  title: "",
  slug: "",
  price: 0,
  original_price: 0,
  discount: 0,
  platform: [],
  category: "",
  rating: 0,
  reviews: 0,
  release_date: "",
  is_new: false,
  is_trending: false,
  on_sale: false,
  publisher: "",
  developer: "",
  description: "",
  features: [],
  image: "",
  banner: "",
  screenshots: [],
};

export default function ManageGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | game id
  const [form, setForm] = useState(EMPTY_GAME);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadGames() {
    setLoading(true);
    const { data } = await supabase
      .from("games")
      .select("*")
      .order("id", { ascending: true });
    setGames(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadGames();
  }, []);

  function startNew() {
    setEditing("new");
    setForm(EMPTY_GAME);
    setError("");
  }

  function startEdit(game) {
    setEditing(game.id);
    setForm({ ...game });
    setError("");
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_GAME);
    setError("");
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    // Auto-generate slug if empty
    const slug =
      form.slug ||
      form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const record = {
      title: form.title,
      slug,
      price: Number(form.price),
      original_price: Number(form.original_price),
      discount: Number(form.discount),
      platform:
        typeof form.platform === "string"
          ? form.platform.split(",").map((s) => s.trim())
          : form.platform,
      category: form.category,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      release_date: form.release_date || null,
      is_new: form.is_new,
      is_trending: form.is_trending,
      on_sale: form.on_sale,
      publisher: form.publisher,
      developer: form.developer,
      description: form.description,
      features:
        typeof form.features === "string"
          ? form.features.split(",").map((s) => s.trim())
          : form.features,
      image: form.image,
      banner: form.banner,
      screenshots:
        typeof form.screenshots === "string"
          ? form.screenshots
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : form.screenshots,
    };

    try {
      if (editing === "new") {
        const { error: e } = await supabase.from("games").insert(record);
        if (e) throw e;
      } else {
        const { error: e } = await supabase
          .from("games")
          .update(record)
          .eq("id", editing);
        if (e) throw e;
      }
      cancelEdit();
      await loadGames();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this game permanently?")) return;
    await supabase.from("games").delete().eq("id", id);
    await loadGames();
  }

  function updateForm(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  if (loading)
    return <div className="admin-panel-loading">Loading games...</div>;

  return (
    <div className="manage-games">
      <div className="admin-header-row">
        <h2>Manage Games ({games.length})</h2>
        {editing === null && (
          <button className="btn btn-primary btn-sm" onClick={startNew}>
            <Plus size={16} /> Add Game
          </button>
        )}
      </div>

      {/* Editor */}
      {editing !== null && (
        <div className="admin-editor">
          <h3>{editing === "new" ? "Add New Game" : "Edit Game"}</h3>
          {error && <div className="admin-error">{error}</div>}

          <div className="editor-grid">
            <div className="editor-field">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="Game title"
              />
            </div>
            <div className="editor-field">
              <label>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>
            <div className="editor-field">
              <label>Price *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label>Original Price</label>
              <input
                type="number"
                step="0.01"
                value={form.original_price}
                onChange={(e) => updateForm("original_price", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label>Discount %</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => updateForm("discount", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label>Category</label>
              <input
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                placeholder="e.g. Action RPG"
              />
            </div>
            <div className="editor-field">
              <label>Platform (comma-sep)</label>
              <input
                value={
                  Array.isArray(form.platform)
                    ? form.platform.join(", ")
                    : form.platform
                }
                onChange={(e) => updateForm("platform", e.target.value)}
                placeholder="PC, PS5, PS4"
              />
            </div>
            <div className="editor-field">
              <label>Rating</label>
              <input
                type="number"
                step="0.1"
                max="5"
                value={form.rating}
                onChange={(e) => updateForm("rating", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label>Reviews</label>
              <input
                type="number"
                value={form.reviews}
                onChange={(e) => updateForm("reviews", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label>Release Date</label>
              <input
                type="date"
                value={form.release_date || ""}
                onChange={(e) => updateForm("release_date", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label>Publisher</label>
              <input
                value={form.publisher}
                onChange={(e) => updateForm("publisher", e.target.value)}
              />
            </div>
            <div className="editor-field">
              <label>Developer</label>
              <input
                value={form.developer}
                onChange={(e) => updateForm("developer", e.target.value)}
              />
            </div>
          </div>

          <div className="editor-field full">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
            />
          </div>
          <div className="editor-field full">
            <label>Features (comma-sep)</label>
            <input
              value={
                Array.isArray(form.features)
                  ? form.features.join(", ")
                  : form.features
              }
              onChange={(e) => updateForm("features", e.target.value)}
            />
          </div>
          <div className="editor-field full">
            <label>Image URL</label>
            <input
              value={form.image}
              onChange={(e) => updateForm("image", e.target.value)}
            />
          </div>
          <div className="editor-field full">
            <label>Banner URL</label>
            <input
              value={form.banner}
              onChange={(e) => updateForm("banner", e.target.value)}
            />
          </div>
          <div className="editor-field full">
            <label>Screenshots (comma-sep URLs)</label>
            <input
              value={
                Array.isArray(form.screenshots)
                  ? form.screenshots.join(", ")
                  : form.screenshots
              }
              onChange={(e) => updateForm("screenshots", e.target.value)}
            />
          </div>

          <div className="editor-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={form.is_new}
                onChange={(e) => updateForm("is_new", e.target.checked)}
              />
              New
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.is_trending}
                onChange={(e) => updateForm("is_trending", e.target.checked)}
              />
              Trending
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.on_sale}
                onChange={(e) => updateForm("on_sale", e.target.checked)}
              />
              On Sale
            </label>
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

      {/* Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Platform</th>
            <th>Sale</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.title}</td>
              <td>${Number(g.price).toFixed(2)}</td>
              <td>{g.category}</td>
              <td>{(g.platform || []).join(", ")}</td>
              <td>
                {g.on_sale ? (
                  <span className="badge-green">Yes</span>
                ) : (
                  <span className="badge-dim">No</span>
                )}
              </td>
              <td className="action-cell">
                <button
                  className="icon-btn-sm"
                  title="Edit"
                  onClick={() => startEdit(g)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="icon-btn-sm danger"
                  title="Delete"
                  onClick={() => handleDelete(g.id)}
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
