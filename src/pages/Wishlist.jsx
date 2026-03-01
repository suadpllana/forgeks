import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useStore, removeFromWishlistDB } from "../context/StoreContext";

export default function Wishlist() {
  const { state, dispatch } = useStore();

  if (!state.user)
    return (
      <div className="empty-page">
        <Heart size={64} strokeWidth={1} />
        <h2>Sign in to view your wishlist</h2>
        <p>Save games you love so you never miss a deal.</p>
        <button
          className="btn btn-primary"
          onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" })}
        >
          Sign In
        </button>
      </div>
    );

  if (state.wishlist.length === 0)
    return (
      <div className="empty-page">
        <Heart size={64} strokeWidth={1} />
        <h2>Your wishlist is empty</h2>
        <p>Save games you love so you never miss a deal.</p>
        <Link to="/games" className="btn btn-primary">
          Browse Games
        </Link>
      </div>
    );

  async function handleRemove(game) {
    dispatch({ type: "TOGGLE_WISHLIST", payload: game });
    await removeFromWishlistDB(game.id);
  }

  return (
    <div className="wishlist-page">
      <h1>Wishlist ({state.wishlist.length})</h1>
      <div className="wishlist-grid">
        {state.wishlist.map((game) => (
          <div key={game.id} className="wishlist-card">
            <Link to={`/games/${game.slug}`}>
              <img src={game.image} alt={game.title} />
            </Link>
            <div className="wishlist-card-body">
              <h3>{game.title}</h3>
              <span className="current-price">${game.price.toFixed(2)}</span>
              <div className="wishlist-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    dispatch({ type: "ADD_TO_CART", payload: game })
                  }
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleRemove(game)}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
