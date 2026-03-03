import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useStore, useFormatPrice } from "../context/StoreContext";
import { useTranslation } from "react-i18next";

export default function GiftCards() {
  const { t } = useTranslation();
  const { state, dispatch } = useStore();
  const formatPrice = useFormatPrice();
  const giftCards = state.giftCards;

  return (
    <div className="gift-cards-page">
      <div className="page-header">
        <h1>🎁 {t("giftCards")}</h1>
        <p>{t("giftJoyDesc")}</p>
      </div>
      <div className="gift-grid">
        {giftCards.map((card) => (
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
