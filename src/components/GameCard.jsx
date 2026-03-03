import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useStore, addToWishlistDB, removeFromWishlistDB, useFormatPrice } from "../context/StoreContext";
import GameImage from "./GameImage";
import toast from "react-hot-toast";

export default function GameCard({ game }) {
  const { state, dispatch } = useStore();
  const formatPrice = useFormatPrice();
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
      toast.success(`Removed from wishlist`);
    } else {
      await addToWishlistDB(game);
      toast.success(`Added to wishlist`);
    }
  }

  return (
    <Link to={`/games/${game.slug}`} className="game-card">
      <div className="game-card-img">
        <GameImage
          src={game.image}
          alt={game.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
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
        </div>
        <div className="game-card-price">
          {game.discount > 0 && (
            <span className="original-price">{formatPrice(game.originalPrice)}</span>
          )}
          <span className="current-price">{formatPrice(game.price)}</span>
        </div>
      </div>
    </Link>
  );
}
