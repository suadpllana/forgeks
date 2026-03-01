import { Link } from "react-router-dom";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function GiftCards() {
  const { state, dispatch } = useStore();
  const giftCards = state.giftCards;

  return (
    <div className="gift-cards-page">
      <div className="page-header">
        <h1>🎁 Gift Cards</h1>
        <p>Instant digital delivery — send the gift of gaming!</p>
      </div>
      <div className="gift-grid">
        {giftCards.map((card) => (
          <div key={card.id} className="gift-card">
            <div className="gift-card-img">
              <img src={card.image} alt={card.title} loading="lazy" />
              <span className="platform-tag">{card.platform}</span>
            </div>
            <div className="gift-card-body">
              <h3>{card.title}</h3>
              <span className="gift-price">${card.price.toFixed(2)}</span>
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
                <ShoppingCart size={14} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
