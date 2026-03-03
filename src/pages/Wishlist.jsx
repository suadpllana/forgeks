import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useStore, removeFromWishlistDB } from "../context/StoreContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { t } = useTranslation();
  const { state, dispatch } = useStore();

  if (!state.user)
    return (
      <div className="empty-page">
        <Heart size={64} strokeWidth={1} />
        <h2>{t("signInWishlist")}</h2>
        <p>{t("saveGamesHere")}</p>
        <button
          className="btn btn-primary"
          onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" })}
        >
          {t("signIn")}
        </button>
      </div>
    );

  if (state.wishlist.length === 0)
    return (
      <div className="empty-page">
        <Heart size={64} strokeWidth={1} />
        <h2>{t("wishlistEmpty")}</h2>
        <p>{t("addGamesToWishlist")}</p>
        <Link to="/games" className="btn btn-primary">
          {t("browseGames")}
        </Link>
      </div>
    );

  async function handleRemove(game) {
    dispatch({ type: "TOGGLE_WISHLIST", payload: game });
    await removeFromWishlistDB(game.id);
    toast.success(`Removed from wishlist`);
  }

  return (
    <div className="wishlist-page">
      <h1>{t("wishlist")} ({state.wishlist.length})</h1>
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
                  <ShoppingCart size={14} /> {t("addToCart")}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleRemove(game)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
