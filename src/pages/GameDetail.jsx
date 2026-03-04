import { useParams, Link } from "react-router-dom";
import BackToHome from "../components/BackToHome";
import { useState, useEffect } from "react";
import {
  Star, ShoppingCart, Heart, CreditCard,
  ChevronLeft, ChevronRight, Check, UserIcon,
  Key, Edit3, Trash2, PlusCircle,
} from "lucide-react";
import { useStore, addToWishlistDB, removeFromWishlistDB, useFormatPrice } from "../context/StoreContext";
import GameImage from "../components/GameImage";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function GameDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { state, dispatch } = useStore();
  const formatPrice = useFormatPrice();
  const game = state.games.find((g) => g.slug === slug);
  const [currentImg, setCurrentImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, message: "", anonymous: false });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!game) return;
    fetchReviews();
  }, [game?.id]);

  async function fetchReviews() {
    setReviewsLoading(true);
    const { data, error } = await supabase
      .from("reviews").select("*")
      .eq("game_id", game.id)
      .order("created_at", { ascending: false });
    if (!error) setReviews(data || []);
    setReviewsLoading(false);
  }

  const userReview = state.user ? reviews.find((r) => r.user_id === state.user.id) : null;

  function openEditForm(review) {
    setReviewForm({ rating: review.rating, message: review.message || "", anonymous: review.anonymous || false });
    setEditMode(true);
    setShowReviewForm(true);
  }

  function handleCancelReview() {
    setShowReviewForm(false);
    setEditMode(false);
    setReviewError("");
    setReviewForm({ rating: 0, message: "", anonymous: false });
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (reviewForm.rating === 0) { setReviewError(t("pleaseSelectRating")); return; }
    setReviewError("");
    setSubmitLoading(true);
    try {
      const { error } = await supabase.from("reviews").upsert(
        { user_id: state.user.id, game_id: game.id, rating: reviewForm.rating,
          message: reviewForm.message.trim(), anonymous: reviewForm.anonymous,
          display_name: reviewForm.anonymous ? "Anonymous" : state.user.name },
        { onConflict: "user_id,game_id" }
      );
      if (error) throw error;
      toast.success(t("reviewSubmitted"));
      setShowReviewForm(false);
      setEditMode(false);
      setReviewForm({ rating: 0, message: "", anonymous: false });
      await fetchReviews();
    } catch (err) { setReviewError(err.message); }
    finally { setSubmitLoading(false); }
  }

  async function handleDeleteReview() {
    if (!userReview) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", userReview.id);
      if (error) throw error;
      toast.success("Review deleted");
      await fetchReviews();
    } catch (err) { toast.error(err.message); }
    finally { setDeleteLoading(false); }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (!game)
    return (
      <div className="not-found-page">
        <h2>Game not found</h2>
        <Link to="/games" className="btn btn-primary">Back to Games</Link>
      </div>
    );

  const inWishlist = state.wishlist.some((i) => i.id === game.id);
  const allImages = [game.banner, ...game.screenshots];

  function handleAddToCart() {
    dispatch({ type: "ADD_TO_CART", payload: game });
    setAddedToCart(true);
    toast.success(`${game.title} added to cart`);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleBuyNow() {
    dispatch({ type: "ADD_TO_CART", payload: game });
    window.location.href = "#/cart";
  }

  return (
    <div className="game-detail-page">
      <BackToHome />
      <div className="breadcrumb">
        <Link to="/games">All Games</Link>
        <span>/</span>
        <span>{game.title}</span>
      </div>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="gallery-main">
            <GameImage
              src={allImages[currentImg]}
              alt={game.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <button
              className="gallery-nav prev"
              onClick={() => setCurrentImg((currentImg - 1 + allImages.length) % allImages.length)}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="gallery-nav next"
              onClick={() => setCurrentImg((currentImg + 1) % allImages.length)}
            >
              <ChevronRight size={24} />
            </button>
            <div className="gallery-counter">{currentImg + 1} / {allImages.length}</div>
          </div>
          <div className="gallery-thumbs">
            {allImages.map((img, i) => (
              <button
                key={i}
                className={`thumb ${i === currentImg ? "active" : ""}`}
                onClick={() => setCurrentImg(i)}
              >
                <GameImage src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <div className="detail-platforms">
            {game.platform.map((p) => <span key={p} className="platform-tag">{p}</span>)}
            {game.isNew && <span className="new-badge">NEW</span>}
          </div>

          <h1>{game.title}</h1>

          <div className="detail-rating">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18}
                fill={avgRating && i < Math.round(Number(avgRating)) ? "var(--accent)" : "transparent"}
                stroke="var(--accent)" />
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
            <div><span className="meta-label">{t("developer")}</span><span>{game.developer}</span></div>
            <div><span className="meta-label">{t("publisher")}</span><span>{game.publisher}</span></div>
            <div><span className="meta-label">{t("releaseDate")}</span><span>{new Date(game.releaseDate).toLocaleDateString()}</span></div>
            <div><span className="meta-label">{t("category")}</span><span>{game.category}</span></div>
          </div>

          <div className="detail-features">
            {game.features.map((f) => <span key={f} className="feature-chip">{f}</span>)}
          </div>

          {/* Digital Key Warning */}
          <div className="digital-key-warning">
            <Key size={16} />
            <div>
              <strong>Digital Product — Activation Key</strong>
              <p>You will receive a digital activation key via email and in My Orders. No physical item will be shipped. Keys are delivered instantly after payment.</p>
            </div>
          </div>

          {/* Price */}
          <div className="detail-price-section">
            <div className="detail-price">
              {game.discount > 0 && (
                <>
                  <span className="discount-badge-lg">-{game.discount}%</span>
                  <span className="original-price-lg">{formatPrice(game.originalPrice)}</span>
                </>
              )}
              <span className="current-price-lg">{formatPrice(game.price)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <Link to="/cart" className="btn btn-primary btn-lg" onClick={handleBuyNow}>
              <CreditCard size={18} /> {t("buyNow")}
            </Link>
            <button
              className={`btn btn-lg ${addedToCart ? "btn-success" : "btn-secondary"}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? <><Check size={18} /> {t("added")}</> : <><ShoppingCart size={18} /> {t("addToCart")}</>}
            </button>
            <button
              className={`btn btn-outline btn-lg ${inWishlist ? "wishlisted" : ""}`}
              onClick={async () => {
                if (!state.user) { dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" }); return; }
                dispatch({ type: "TOGGLE_WISHLIST", payload: game });
                if (inWishlist) { await removeFromWishlistDB(game.id); toast.success("Removed from wishlist"); }
                else { await addToWishlistDB(game); toast.success("Added to wishlist"); }
              }}
            >
              <Heart size={18} fill={inWishlist ? "var(--accent)" : "none"} />
              {inWishlist ? t("wishlisted") : t("wishlist")}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2 className="reviews-title">{t("userReviews")}</h2>

        {state.user ? (
          <>
            {!userReview && !showReviewForm && (
              <button className="btn btn-outline leave-review-btn" onClick={() => setShowReviewForm(true)}>
                <PlusCircle size={16} /> {t("leaveReview")}
              </button>
            )}

            {showReviewForm && (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <h3>{editMode ? "Edit Your Review" : t("leaveReview")}</h3>
                <div className="review-stars-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                      className="star-pick-btn"
                    >
                      <Star size={28}
                        fill={(hoverRating || reviewForm.rating) >= star ? "var(--accent)" : "transparent"}
                        stroke="var(--accent)" />
                    </button>
                  ))}
                  <span className="star-pick-label">
                    {[t("selectRating"), t("poor"), t("fair"), t("good"), t("veryGood"), t("excellent")][hoverRating || reviewForm.rating]}
                  </span>
                </div>

                <textarea
                  className="review-textarea"
                  placeholder={t("writeReview")}
                  value={reviewForm.message}
                  onChange={(e) => setReviewForm((f) => ({ ...f, message: e.target.value }))}
                  rows={4}
                />

                <label className="review-anon-toggle">
                  <input type="checkbox" checked={reviewForm.anonymous}
                    onChange={(e) => setReviewForm((f) => ({ ...f, anonymous: e.target.checked }))} />
                  {t("postAnonymously")}
                </label>

                {reviewError && <p className="review-msg error">{reviewError}</p>}

                <div className="review-form-actions">
                  <button type="submit" className="btn btn-primary review-submit-btn" disabled={submitLoading}>
                    {submitLoading ? t("submitting") : t("submitReview")}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={handleCancelReview}>
                    {t("cancel")}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="review-sign-in-prompt">
            <UserIcon size={32} />
            <p>{t("signInToReview")}</p>
            <button className="btn btn-primary" onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" })}>
              {t("signIn")}
            </button>
          </div>
        )}

        {/* Reviews list */}
        <div className="reviews-list">
          {reviewsLoading ? (
            <p className="reviews-empty">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="reviews-empty">{t("noReviewsYet")}</p>
          ) : (
            reviews.map((r) => {
              const isOwnReview = state.user && r.user_id === state.user.id;
              return (
                <div key={r.id} className={`review-card ${isOwnReview ? "own-review" : ""}`}>
                  <div className="review-card-header">
                    <div className="review-card-meta">
                      <span className="review-author">
                        {r.display_name || "Anonymous"}
                        {isOwnReview && <span className="own-review-badge">You</span>}
                      </span>
                      <span className="review-date">
                        {new Date(r.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="review-card-right">
                      <div className="review-card-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} fill={s <= r.rating ? "var(--accent)" : "transparent"} stroke="var(--accent)" />
                        ))}
                      </div>
                      {isOwnReview && (
                        <div className="review-own-actions">
                          <button className="btn btn-outline btn-xs" onClick={() => openEditForm(r)}>
                            <Edit3 size={13} /> Edit
                          </button>
                          <button className="btn btn-outline btn-xs btn-danger" onClick={handleDeleteReview} disabled={deleteLoading}>
                            <Trash2 size={13} /> {deleteLoading ? "..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {r.message && <p className="review-message">{r.message}</p>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
