import { Link } from "react-router-dom";
import { Zap, Gift, TrendingUp, Clock, Tag, Star, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import GameCard from "../components/GameCard";
import { useStore, useFormatPrice } from "../context/StoreContext";
import GameImage from "../components/GameImage";

export default function Home() {
  const { t } = useTranslation();
  const { state } = useStore();
  const formatPrice = useFormatPrice();
  const games = state.games;
  const trending = games.filter((g) => g.isTrending).slice(0, 5);
  const newReleases = games.filter((g) => g.isNew).slice(0, 5);
  const onSale = games.filter((g) => g.onSale).slice(0, 5);
  const featured = games.find((g) => g.isTrending && g.rating >= 4.6) || games[0];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <span className="hero-badge"><Zap size={14} /> {t("heroTagline")}</span>
          <h1 className="hero-title">{t("heroTitle")}</h1>
          <p className="hero-desc">{t("heroDesc")}</p>
          <div className="hero-actions">
            <Link to="/games" className="btn btn-primary btn-lg">{t("browseGames")}</Link>
            <Link to="/gift-cards" className="btn btn-outline btn-lg"><Gift size={18} />{t("giftCards")}</Link>
          </div>
        </div>
        <div className="hero-glow" />
      </section>

      {featured && (
        <section className="featured-poster-section">
          <div className="featured-poster">
            <div className="featured-poster-overlay">
              <div className="featured-poster-content">
                <span className="featured-label">Featured Game</span>
                <h2 className="featured-title">{featured.title}</h2>
                <div className="featured-meta">
                  <div className="featured-rating">
                    <Star size={16} fill="var(--accent)" stroke="var(--accent)" />
                    <span>{featured.rating}</span>
                  </div>
                  {featured.platform.map((p) => (
                    <span key={p} className="platform-tag">
                      {p}
                    </span>
                  ))}
                </div>
                <p className="featured-desc">
                  {featured.description?.slice(0, 130)}...
                </p>
                <div className="featured-actions">
                  <Link to={`/games/${featured.slug}`} className="btn btn-primary">
                    View Game <ChevronRight size={16} />
                  </Link>
                  <span className="featured-price">{formatPrice(featured.price)}</span>
                </div>
              </div>
              <div className="featured-poster-art">
                <GameImage
                  src={featured.banner || featured.image}
                  alt={featured.title}
                  className="featured-poster-img"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-header">
          <h2><TrendingUp size={22} /> {t("topGames")}</h2>
          <Link to="/games" className="see-all">{t("seeAll")} &rarr;</Link>
        </div>
        <div className="game-grid">{trending.map((g) => <GameCard key={g.id} game={g} />)}</div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2><Clock size={22} /> {t("newReleases")}</h2>
          <Link to="/games" className="see-all">{t("seeAll")} &rarr;</Link>
        </div>
        <div className="game-grid">{newReleases.map((g) => <GameCard key={g.id} game={g} />)}</div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2><Tag size={22} /> {t("onSale")}</h2>
          <Link to="/games?sale=true" className="see-all">{t("seeAll")} &rarr;</Link>
        </div>
        <div className="game-grid">{onSale.map((g) => <GameCard key={g.id} game={g} />)}</div>
      </section>

      <section className="promo-banner">
        <div className="promo-content">
          <h2>🎁 {t("giftJoy")}</h2>
          <p>{t("giftJoyDesc")}</p>
          <Link to="/gift-cards" className="btn btn-primary">{t("shopGiftCards")}</Link>
        </div>
      </section>
    </div>
  );
}
