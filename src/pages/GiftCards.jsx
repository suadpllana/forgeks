import { useMemo, useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { useStore, useFormatPrice } from "../context/StoreContext";
import { useTranslation } from "react-i18next";

export default function GiftCards() {
  const { t } = useTranslation();
  const { state, dispatch } = useStore();
  const formatPrice = useFormatPrice();
  const giftCards = state.giftCards;

  const [platformFilter, setPlatformFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("none");
  const [search, setSearch] = useState("");

  const platforms = useMemo(() => {
    const all = [...new Set(giftCards.map((c) => c.platform).filter(Boolean))];
    return all.sort();
  }, [giftCards]);

  const filtered = useMemo(() => {
    let list = [...giftCards];
    if (platformFilter !== "all") list = list.filter((c) => c.platform === platformFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.title?.toLowerCase().includes(q));
    }
    if (priceSort === "asc") list.sort((a, b) => a.price - b.price);
    if (priceSort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [giftCards, platformFilter, priceSort, search]);

  return (
    <div className="gift-cards-page">
      <div className="page-header">
        <h1>🎁 {t("giftCards")}</h1>
        <p>{t("giftJoyDesc")}</p>
      </div>

      <div className="gift-cards-controls">
        <div className="page-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search gift cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="gift-filter-select"
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
        >
          <option value="all">All Platforms</option>
          {platforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          className="gift-filter-select"
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
        >
          <option value="none">Sort by price</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      <div className="gift-grid">
        {filtered.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            <p>No gift cards match your filters.</p>
          </div>
        )}
        {filtered.map((card) => (
          <div key={card.id} className="gift-card">
            <div className="gift-card-img">
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/300x240/13131a/8888a0?text=${encodeURIComponent(card.title)}`;
                }}
              />
              <span className="platform-tag">{card.platform}</span>
            </div>
            <div className="gift-card-body">
              <h3>{card.title}</h3>
              <span className="gift-price">{formatPrice(card.price)}</span>
              <button
                className="btn btn-primary btn-sm full-width"
                onClick={() =>
                  dispatch({
                    type: "ADD_TO_CART",
                    payload: {
                      id: card.id,
                      title: card.title,
                      price: card.price,
                      image: card.image,
                      platform: [card.platform],
                    },
                  })
                }
              >
                <ShoppingCart size={14} /> {t("addToCart")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
