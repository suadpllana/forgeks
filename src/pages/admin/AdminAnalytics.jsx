import { useState, useEffect } from "react";
import { BarChart3, Heart, ShoppingBag, Star, DollarSign, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [wishlistData, setWishlistData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);

    // 1. Most wishlisted games
    const { data: wishlistRaw } = await supabase
      .from("wishlist")
      .select("game_id, games(title, image)");

    const wishlistMap = {};
    (wishlistRaw || []).forEach((w) => {
      if (!w.games) return;
      if (!wishlistMap[w.game_id])
        wishlistMap[w.game_id] = { title: w.games.title, image: w.games.image, count: 0 };
      wishlistMap[w.game_id].count++;
    });
    const wishSorted = Object.values(wishlistMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    setWishlistData(wishSorted);

    // 2. Most purchased (from orders)
    const { data: ordersRaw } = await supabase.from("orders").select("items, total");
    const purchaseMap = {};
    const revenueMap = {};
    (ordersRaw || []).forEach((order) => {
      const items = order.items || [];
      items.forEach((item) => {
        const key = item.title || item.name;
        if (!key) return;
        if (!purchaseMap[key])
          purchaseMap[key] = { title: key, image: item.image, count: 0 };
        purchaseMap[key].count += item.qty || 1;

        if (!revenueMap[key])
          revenueMap[key] = { title: key, image: item.image, revenue: 0 };
        revenueMap[key].revenue += (item.price || 0) * (item.qty || 1);
      });
    });
    const purchSorted = Object.values(purchaseMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    setPurchaseData(purchSorted);

    const revSorted = Object.values(revenueMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    setRevenueData(revSorted);

    // 3. Most reviewed
    const { data: reviewsRaw } = await supabase
      .from("reviews")
      .select("game_id, games(title, image)");

    const reviewMap = {};
    (reviewsRaw || []).forEach((r) => {
      if (!r.games) return;
      if (!reviewMap[r.game_id])
        reviewMap[r.game_id] = { title: r.games.title, image: r.games.image, count: 0 };
      reviewMap[r.game_id].count++;
    });
    const revwSorted = Object.values(reviewMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    setReviewData(revwSorted);

    setLoading(false);
  }

  if (loading) return <div className="admin-panel-loading">Loading analytics...</div>;

  function BarList({ data, valueKey, valueLabel, icon: Icon, color }) {
    if (!data.length) return <p className="admin-muted">No data yet.</p>;
    const max = Math.max(...data.map((d) => d[valueKey]));
    return (
      <div className="analytics-bar-list">
        {data.map((item, i) => (
          <div key={i} className="analytics-bar-item">
            <div className="analytics-bar-info">
              {item.image && (
                <img src={item.image} alt="" className="analytics-bar-img" />
              )}
              <span className="analytics-bar-title">{item.title}</span>
            </div>
            <div className="analytics-bar-track">
              <div
                className="analytics-bar-fill"
                style={{
                  width: `${(item[valueKey] / max) * 100}%`,
                  background: color,
                }}
              />
            </div>
            <span className="analytics-bar-value">
              {valueKey === "revenue" ? `$${item[valueKey].toFixed(2)}` : item[valueKey]}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      <h2>
        <BarChart3 size={22} /> Analytics Overview
      </h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>
            <Heart size={18} /> Most Wishlisted
          </h3>
          <BarList
            data={wishlistData}
            valueKey="count"
            valueLabel="Wishlists"
            icon={Heart}
            color="var(--red)"
          />
        </div>

        <div className="analytics-card">
          <h3>
            <ShoppingBag size={18} /> Most Purchased
          </h3>
          <BarList
            data={purchaseData}
            valueKey="count"
            valueLabel="Purchases"
            icon={ShoppingBag}
            color="var(--green)"
          />
        </div>

        <div className="analytics-card">
          <h3>
            <Star size={18} /> Most Reviewed
          </h3>
          <BarList
            data={reviewData}
            valueKey="count"
            valueLabel="Reviews"
            icon={Star}
            color="var(--orange)"
          />
        </div>

        <div className="analytics-card">
          <h3>
            <DollarSign size={18} /> Revenue by Game
          </h3>
          <BarList
            data={revenueData}
            valueKey="revenue"
            valueLabel="Revenue"
            icon={DollarSign}
            color="var(--accent)"
          />
        </div>
      </div>
    </div>
  );
}
