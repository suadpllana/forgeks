import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useStore, addToWishlistDB, removeFromWishlistDB } from "../context/StoreContext";

export default function GameCard({ game }) {
  const { state, dispatch } = useStore();
  const inWishlist = state.wishlist.some((i) => i.id === game.id);

  async function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!state.user) {
      dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" });
      return;
    }
    dispatch({ type: "TOGGLE_WISHLIST", payload: game });
    if (inWishlist) {
      await removeFromWishlistDB(game.id);
    } else {
      await addToWishlistDB(game);
    }
  }

  return (
    <Link to={`/games/${game.slug}`} className="game-card">
      <div className="game-card-img">
        <img src={game.image} alt={game.title} loading="lazy" />
        {game.discount > 0 && (
          <span className="discount-badge">-{game.discount}%</span>
        )}
        {game.isNew && <span className="new-badge">NEW</span>}
        <button
          className={`card-wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={handleWishlist}
          title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={16} fill={inWishlist ? "var(--accent)" : "none"} stroke={inWishlist ? "var(--accent)" : "currentColor"} />
        </button>
      </div>
      <div className="game-card-body">
        <div className="game-card-platforms">
          {game.platform.map((p) => (
            <span key={p} className="platform-tag">
              {p}
            </span>
          ))}
        </div>
        <h3 className="game-card-title">{game.title}</h3>
        <div className="game-card-rating">
          <Star size={13} fill="var(--accent)" stroke="var(--accent)" />
          <span>{game.rating}</span>
          <span className="reviews-count">({game.reviews.toLocaleString()})</span>
        </div>
        <div className="game-card-price">
          {game.discount > 0 && (
            <span className="original-price">${game.originalPrice.toFixed(2)}</span>
          )}
          <span className="current-price">${game.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
