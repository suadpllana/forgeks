import { useMemo, useState } from "react";
import { SlidersHorizontal, LayoutGrid, List, Loader } from "lucide-react";
import GameCard from "../components/GameCard";
import { useStore } from "../context/StoreContext";

const PLATFORMS = ["PC", "PS5", "PS4"];
const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];

export default function AllGames() {
  const { state } = useStore();
  const games = state.games;
  const CATEGORIES = useMemo(() => [...new Set(games.map((g) => g.category))], [games]);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  function togglePlatform(p) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function toggleCategory(c) {
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  const filtered = useMemo(() => {
    let list = [...games];

    // Search — normalize diacritics so e.g. "ragnarok" matches "Ragnarök"
    if (state.searchQuery.trim()) {
      const normalize = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const q = normalize(state.searchQuery);
      list = list.filter(
        (g) =>
          normalize(g.title).includes(q) ||
          normalize(g.category).includes(q) ||
          normalize(g.publisher).includes(q)
      );
    }

    // Platform
    if (platforms.length)
      list = list.filter((g) => g.platform.some((p) => platforms.includes(p)));

    // Category
    if (categories.length)
      list = list.filter((g) => categories.includes(g.category));

    // Sale
    if (onSaleOnly) list = list.filter((g) => g.onSale);

    // Sort
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        break;
    }

    return list;
  }, [games, state.searchQuery, platforms, categories, onSaleOnly, sort]);

  return (
    <div className="all-games-page">
      <div className="page-header">
        <h1>All Games</h1>
        <div className="header-controls">
          <span className="results-count">{filtered.length} games</span>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Sidebar */}
        <aside className={`filter-sidebar ${showFilters ? "open" : ""}`}>
          <div className="filter-group">
            <h4>Platform</h4>
            {PLATFORMS.map((p) => (
              <label key={p} className="filter-check">
                <input
                  type="checkbox"
                  checked={platforms.includes(p)}
                  onChange={() => togglePlatform(p)}
                />
                <span className="checkmark" />
                {p}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Category</h4>
            {CATEGORIES.map((c) => (
              <label key={c} className="filter-check">
                <input
                  type="checkbox"
                  checked={categories.includes(c)}
                  onChange={() => toggleCategory(c)}
                />
                <span className="checkmark" />
                {c}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <label className="filter-check">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={() => setOnSaleOnly(!onSaleOnly)}
              />
              <span className="checkmark" />
              On Sale Only
            </label>
          </div>
        </aside>

        {/* Grid / List */}
        <div className={viewMode === "list" ? "game-list" : "game-grid catalog-grid"}>
          {state.gamesLoading ? (
            <div className="empty-state">
              <Loader size={28} className="spin" style={{ marginBottom: 12 }} />
              <p>Loading games…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>No games found matching your criteria.</p>
            </div>
          ) : (
            filtered.map((g) => <GameCard key={g.id} game={g} />)
          )}
        </div>
      </div>
    </div>
  );
}
