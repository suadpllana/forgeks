import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, CreditCard, Tag } from "lucide-react";
import { useStore, placeOrderDB, validateDiscountCode, useFormatPrice } from "../context/StoreContext";
import { useTranslation } from "react-i18next";
import PayPalCheckout from "../components/PayPalCheckout";
import CryptoCheckout from "../components/CryptoCheckout";
import toast from "react-hot-toast";

export default function Cart() {
  const { t } = useTranslation();
  const { state, dispatch } = useStore();
  const formatPrice = useFormatPrice();
  const [placing, setPlacing] = useState(false);
  const [paymentMode, setPaymentMode] = useState(null); // null | 'paypal' | 'crypto'
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountMsg, setDiscountMsg] = useState({ text: "", type: "" });
  const [applyingCode, setApplyingCode] = useState(false);

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "percent") {
      discountAmount = (subtotal * appliedDiscount.value) / 100;
    } else {
      discountAmount = appliedDiscount.value;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }
  const total = Math.max(0, subtotal - discountAmount);

  async function handleApplyDiscount() {
    if (!discountCode.trim()) return;
    setApplyingCode(true);
    setDiscountMsg({ text: "", type: "" });

    const result = await validateDiscountCode(discountCode.trim());
    if (result.valid) {
      setAppliedDiscount(result.discount);
      setDiscountMsg({ text: t("discountApplied"), type: "success" });
    } else {
      setDiscountMsg({ text: t("invalidCode"), type: "error" });
    }
    setApplyingCode(false);
  }

  async function completeOrder(paymentMethod = "direct", cryptoDetails = null) {
    setPlacing(true);
    const { order, error } = await placeOrderDB(state.cart, discountAmount, paymentMethod, cryptoDetails);
    setPlacing(false);
    if (error) {
      toast.error(t("orderFailed") + error.message);
      return;
    }
    dispatch({ type: "ADD_ORDER", payload: order });
    setAppliedDiscount(null);
    setDiscountCode("");
    toast.success(t("orderPlaced"), { icon: '🎉' });
  }

  async function handleDirectCheckout() {
    if (!state.user) {
      dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" });
      return;
    }
    await completeOrder("direct");
  }

  async function handlePayPalSuccess(details) {
    setPaymentMode(null);
    await completeOrder("paypal");
  }

  async function handleCryptoSuccess(details) {
    setPaymentMode(null);
    await completeOrder("crypto", {
      crypto: details.crypto,
      cryptoName: details.cryptoName,
      network: details.network,
      networkName: details.networkName,
      address: details.address,
    });
    toast.success(t("cryptoOrderPending"), { icon: '⏳', duration: 5000 });
  }

  if (state.cart.length === 0)
    return (
      <div className="empty-page">
        <ShoppingBag size={64} strokeWidth={1} />
        <h2>{t("yourCartEmpty")}</h2>
        <p>{t("browseAddGames")}</p>
        <Link to="/games" className="btn btn-primary">
          {t("browseGames")}
        </Link>
      </div>
    );

  return (
    <div className="cart-page">
      <Link to="/games" className="back-link">
        <ArrowLeft size={16} /> {t("continueShopping")}
      </Link>
      <h1>{t("shoppingCart")} ({state.cart.length})</h1>

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
                {formatPrice(item.price * item.qty)}
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
          <h3>{t("orderSummary")}</h3>

          {/* Discount code */}
          <div className="discount-section">
            <div className="discount-input-row">
              <Tag size={16} />
              <input
                type="text"
                placeholder={t("discountCode")}
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
              />
              <button
                className="btn btn-sm btn-outline"
                onClick={handleApplyDiscount}
                disabled={applyingCode}
              >
                {t("apply")}
              </button>
            </div>
            {discountMsg.text && (
              <p className={`discount-msg ${discountMsg.type}`}>
                {discountMsg.text}
              </p>
            )}
          </div>

          <div className="summary-row">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="summary-row discount-row">
              <span>{t("discount")}</span>
              <span className="discount-value">-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>{t("delivery")}</span>
            <span className="free">{t("freeDigital")}</span>
          </div>
          <div className="summary-row total">
            <span>{t("total")}</span>
            <span>{formatPrice(total)}</span>
          </div>

          {/* Payment options */}
          <div className="payment-options">
            <button
              className="btn btn-primary full-width"
              onClick={handleDirectCheckout}
              disabled={placing}
            >
              <CreditCard size={16} />
              {placing ? t("placingOrder") : `${t("directCheckout")} — ${formatPrice(total)}`}
            </button>
            <button
              className="btn btn-paypal full-width"
              onClick={() => {
                if (!state.user) {
                  dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" });
                  return;
                }
                setPaymentMode("paypal");
              }}
            >
              <span className="paypal-icon">P</span> {t("payWithPaypal")}
            </button>
            <button
              className="btn btn-crypto full-width"
              onClick={() => {
                if (!state.user) {
                  dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" });
                  return;
                }
                setPaymentMode("crypto");
              }}
            >
              ₿ {t("payWithCrypto")}
            </button>
          </div>
        </div>
      </div>

      {/* Payment modals */}
      {paymentMode === "paypal" && (
        <PayPalCheckout
          total={total}
          onSuccess={handlePayPalSuccess}
          onCancel={() => setPaymentMode(null)}
        />
      )}
      {paymentMode === "crypto" && (
        <CryptoCheckout
          total={total}
          onSuccess={handleCryptoSuccess}
          onCancel={() => setPaymentMode(null)}
        />
      )}
    </div>
  );
}
