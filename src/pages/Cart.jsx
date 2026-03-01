import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useStore, placeOrderDB } from "../context/StoreContext";

export default function Cart() {
  const { state, dispatch } = useStore();
  const [placing, setPlacing] = useState(false);
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  async function handleCheckout() {
    if (!state.user) {
      dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" });
      return;
    }
    setPlacing(true);
    const { order, error } = await placeOrderDB(state.cart);
    setPlacing(false);
    if (error) {
      alert("Failed to place order: " + error.message);
      return;
    }
    dispatch({ type: "ADD_ORDER", payload: order });
    alert("🎉 Order placed! Check your keys in My Orders.");
  }

  if (state.cart.length === 0)
    return (
      <div className="empty-page">
        <ShoppingBag size={64} strokeWidth={1} />
        <h2>Your cart is empty</h2>
        <p>Browse our catalog and add some games!</p>
        <Link to="/games" className="btn btn-primary">
          Browse Games
        </Link>
      </div>
    );

  return (
    <div className="cart-page">
      <Link to="/games" className="back-link">
        <ArrowLeft size={16} /> Continue Shopping
      </Link>
      <h1>Shopping Cart ({state.cart.length})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {state.cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} />
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <div className="cart-item-platforms">
                  {item.platform?.map((p) => (
                    <span key={p} className="platform-tag sm">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="cart-qty">
                <button
                  onClick={() =>
                    item.qty > 1
                      ? dispatch({
                          type: "UPDATE_QTY",
                          payload: { id: item.id, qty: item.qty - 1 },
                        })
                      : dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                  }
                >
                  <Minus size={14} />
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_QTY",
                      payload: { id: item.id, qty: item.qty + 1 },
                    })
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="cart-item-price">
                ${(item.price * item.qty).toFixed(2)}
              </div>
              <button
                className="cart-remove"
                onClick={() =>
                  dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free">FREE (Digital)</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary full-width" onClick={handleCheckout} disabled={placing}>
            {placing ? "Placing order..." : `Checkout — $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
