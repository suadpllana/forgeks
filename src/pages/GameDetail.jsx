import { useParams, Link } from "react-router-dom";
import BackToHome from "../components/BackToHome";
import { useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Check,
  UserIcon,
} from "lucide-react";
import { useStore, addToWishlistDB, removeFromWishlistDB } from "../context/StoreContext";
import { supabase } from "../lib/supabase";

export default function GameDetail() {
  const { slug } = useParams();
  const { state, dispatch } = useStore();
  const game = state.games.find((g) => g.slug === slug);
  const [currentImg, setCurrentImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, message: "", anonymous: false });

  useEffect(() => {
    if (!game) return;
    fetchReviews();
  }, [game?.id]);

  async function fetchReviews() {
    setReviewsLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("game_id", game.id)
      .order("created_at", { ascending: false });
    if (!error) setReviews(data || []);
    setReviewsLoading(false);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (reviewForm.rating === 0) { setReviewError("Please select a star rating."); return; }
    setReviewError("");
    setReviewSuccess("");
    setSubmitLoading(true);
    try {
      const { error } = await supabase.from("reviews").upsert({
        user_id: state.user.id,
        game_id: game.id,
        rating: reviewForm.rating,
        message: reviewForm.message.trim(),
        anonymous: reviewForm.anonymous,
        display_name: reviewForm.anonymous ? "Anonymous" : state.user.name,
      }, { onConflict: "user_id,game_id" });
      if (error) throw error;
      setReviewSuccess("Review submitted!");
      setReviewForm({ rating: 0, message: "", anonymous: false });
      await fetchReviews();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (!game)
    return (
      <div className="not-found-page">
        <h2>Game not found</h2>
        <Link to="/games" className="btn btn-primary">
          Back to Games
        </Link>
      </div>
    );

  const inWishlist = state.wishlist.some((i) => i.id === game.id);
  const allImages = [game.banner, ...game.screenshots];

  function handleAddToCart() {
    dispatch({ type: "ADD_TO_CART", payload: game });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleBuyNow() {
    dispatch({ type: "ADD_TO_CART", payload: game });
    window.location.href = "#/cart";
  }

  return (
    <div className="game-detail-page">
      <BackToHome />
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/games">All Games</Link>
        <span>/</span>
        <span>{game.title}</span>
      </div>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="gallery-main">
            <img
              src={allImages[currentImg]}
              alt={game.title}
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/920x430/13131a/8888a0?text=${encodeURIComponent(game.title)}`; }}
            />
            <button
              className="gallery-nav prev"
              onClick={() =>
                setCurrentImg(
                  (currentImg - 1 + allImages.length) % allImages.length
                )
              }
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="gallery-nav next"
              onClick={() =>
                setCurrentImg((currentImg + 1) % allImages.length)
              }
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="gallery-thumbs">
            {allImages.map((img, i) => (
              <button
                key={i}
                className={`thumb ${i === currentImg ? "active" : ""}`}
                onClick={() => setCurrentImg(i)}
              >
                <img src={img} alt="" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/120x66/13131a/8888a0?text=...`; }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <div className="detail-platforms">
            {game.platform.map((p) => (
              <span key={p} className="platform-tag">
                {p}
              </span>
            ))}
            {game.isNew && <span className="new-badge">NEW</span>}
          </div>

          <h1>{game.title}</h1>

          <div className="detail-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={avgRating && i < Math.round(Number(avgRating)) ? "var(--accent)" : "transparent"}
                stroke="var(--accent)"
              />
            ))}
            {avgRating ? (
              <>
                <span className="rating-value">{avgRating}</span>
                <span className="reviews-count">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
              </>
            ) : (
              <span className="reviews-count">No reviews yet</span>
            )}
          </div>

          <p className="detail-description">{game.description}</p>

          <div className="detail-meta">
            <div>
              <span className="meta-label">Developer</span>
              <span>{game.developer}</span>
            </div>
            <div>
              <span className="meta-label">Publisher</span>
              <span>{game.publisher}</span>
            </div>
            <div>
              <span className="meta-label">Release Date</span>
              <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="meta-label">Category</span>
              <span>{game.category}</span>
            </div>
          </div>

          <div className="detail-features">
            {game.features.map((f) => (
              <span key={f} className="feature-chip">
                {f}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="detail-price-section">
            <div className="detail-price">
              {game.discount > 0 && (
                <>
                  <span className="discount-badge-lg">-{game.discount}%</span>
                  <span className="original-price-lg">
                    ${game.originalPrice.toFixed(2)}
                  </span>
                </>
              )}
              <span className="current-price-lg">${game.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <Link to="/cart" className="btn btn-primary btn-lg" onClick={handleBuyNow}>
              <CreditCard size={18} /> Buy Now
            </Link>
            <button
              className={`btn btn-lg ${addedToCart ? "btn-success" : "btn-secondary"}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <Check size={18} /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Add to Cart
                </>
              )}
            </button>
            <button
              className={`btn btn-outline btn-lg ${inWishlist ? "wishlisted" : ""}`}
              onClick={async () => {
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
              }}
            >
              <Heart size={18} fill={inWishlist ? "var(--accent)" : "none"} />
              {inWishlist ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div className="reviews-section">
        <h2 className="reviews-title">User Reviews</h2>

        {/* Submit form */}
        {state.user ? (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Leave a Review</h3>

            {/* Star picker */}
            <div className="review-stars-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                  className="star-pick-btn"
                >
                  <Star
                    size={28}
                    fill={(hoverRating || reviewForm.rating) >= star ? "var(--accent)" : "transparent"}
                    stroke="var(--accent)"
                  />
                </button>
              ))}
              <span className="star-pick-label">
                {["Select rating", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                  hoverRating || reviewForm.rating
                ]}
              </span>
            </div>

            <textarea
              className="review-textarea"
              placeholder="Share your thoughts about this game (optional)..."
              value={reviewForm.message}
              onChange={(e) => setReviewForm((f) => ({ ...f, message: e.target.value }))}
              rows={4}
            />

            <label className="review-anon-toggle">
              <input
                type="checkbox"
                checked={reviewForm.anonymous}
                onChange={(e) => setReviewForm((f) => ({ ...f, anonymous: e.target.checked }))}
              />
              Post as Anonymous
            </label>

            {reviewError && <p className="review-msg error">{reviewError}</p>}
            {reviewSuccess && <p className="review-msg success">{reviewSuccess}</p>}

            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
              {submitLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="review-sign-in-prompt">
            <UserIcon size={32} />
            <p>Sign in to leave a review</p>
            <button
              className="btn btn-primary"
              onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" })}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Reviews list */}
        <div className="reviews-list">
          {reviewsLoading ? (
            <p className="reviews-empty">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="reviews-empty">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="review-card-header">
                  <div className="review-card-meta">
                    <span className="review-author">{r.display_name || "Anonymous"}</span>
                    <span className="review-date">
                      {new Date(r.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="review-card-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= r.rating ? "var(--accent)" : "transparent"}
                        stroke="var(--accent)"
                      />
                    ))}
                  </div>
                </div>
                {r.message && <p className="review-message">{r.message}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
