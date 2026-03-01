import { Link } from "react-router-dom";
import { Zap, Gift, TrendingUp, Clock, Tag } from "lucide-react";
import GameCard from "../components/GameCard";
import { useStore } from "../context/StoreContext";

export default function Home() {
  const { state } = useStore();
  const games = state.games;
  const trending = games.filter((g) => g.isTrending).slice(0, 4);
  const newReleases = games.filter((g) => g.isNew).slice(0, 4);
  const onSale = games.filter((g) => g.onSale).slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <span className="hero-badge">
            <Zap size={14} /> New Releases Every Week
          </span>
          <h1 className="hero-title">LEVEL UP YOUR GAME</h1>
          <p className="hero-desc">
            Thousands of titles for PC, PS5 &amp; PS4 — instant delivery to your inbox.
          </p>
          <div className="hero-actions">
            <Link to="/games" className="btn btn-primary btn-lg">
              Browse Games
            </Link>
            <Link to="/gift-cards" className="btn btn-outline btn-lg">
              <Gift size={18} />
              Gift Cards
            </Link>
          </div>
        </div>
        <div className="hero-glow" />
      </section>

      {/* Top Games */}
      <section className="section">
        <div className="section-header">
          <h2>
            <TrendingUp size={22} /> Top Games
          </h2>
          <Link to="/games" className="see-all">
            See all &rarr;
          </Link>
        </div>
        <div className="game-grid">
          {trending.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="section">
        <div className="section-header">
          <h2>
            <Clock size={22} /> New Releases
          </h2>
          <Link to="/games" className="see-all">
            See all &rarr;
          </Link>
        </div>
        <div className="game-grid">
          {newReleases.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>

      {/* On Sale */}
      <section className="section">
        <div className="section-header">
          <h2>
            <Tag size={22} /> On Sale
          </h2>
          <Link to="/games?sale=true" className="see-all">
            See all &rarr;
          </Link>
        </div>
        <div className="game-grid">
          {onSale.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>🎮 Gift the Joy of Gaming</h2>
          <p>Send digital gift cards instantly — perfect for every gamer.</p>
          <Link to="/gift-cards" className="btn btn-primary">
            Shop Gift Cards
          </Link>
        </div>
      </section>
    </div>
  );
}
