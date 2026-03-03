import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, EyeOff, ClipboardCopy, Clock, CheckCircle, XCircle, Timer, Copy, Check } from "lucide-react";
import { useStore, useFormatPrice } from "../context/StoreContext";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

// ── Countdown timer component ───────────────────────────────────
function CryptoCountdown({ orderDate, orderId, onExpired }) {
  const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const deadline = new Date(orderDate).getTime() + TIMEOUT_MS;

  const calcRemaining = useCallback(() => Math.max(0, deadline - Date.now()), [deadline]);
  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    if (remaining <= 0) {
      onExpired(orderId);
      return;
    }
    const timer = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r <= 0) {
        clearInterval(timer);
        onExpired(orderId);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining, calcRemaining, orderId, onExpired]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const isUrgent = remaining < 5 * 60 * 1000; // under 5 min

  return (
    <span className={`crypto-timer ${isUrgent ? "urgent" : ""}`}>
      <Timer size={14} />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </span>
  );
}

// ── Orders page ─────────────────────────────────────────────────
export default function Orders() {
  const { state, dispatch } = useStore();
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const [visibleKeys, setVisibleKeys] = useState({});
  const [copiedAddress, setCopiedAddress] = useState(null);

  function copyAddress(orderId, address) {
    navigator.clipboard.writeText(address);
    setCopiedAddress(orderId);
    setTimeout(() => setCopiedAddress(null), 2000);
  }

  // Auto-reject expired crypto orders
  const handleExpired = useCallback(async (orderId) => {
    // Update in DB
    await supabase
      .from("orders")
      .update({ status: "rejected" })
      .eq("id", orderId)
      .eq("status", "pending_crypto"); // only if still pending

    // Update local state
    dispatch({
      type: "SET_ORDERS",
      payload: state.orders.map((o) =>
        o.id === orderId && o.status === "pending_crypto"
          ? { ...o, status: "rejected" }
          : o
      ),
    });
  }, [dispatch, state.orders]);

  function toggleKey(orderId, idx) {
    const k = `${orderId}-${idx}`;
    setVisibleKeys((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  function copyKey(key) {
    navigator.clipboard.writeText(key);
  }

  if (!state.user) {
    return (
      <div className="empty-page">
        <Package size={64} strokeWidth={1} />
        <h2>{t("signInOrders")}</h2>
        <p>{t("keysAppearHere")}</p>
        <button
          className="btn btn-primary"
          onClick={() =>
            dispatch({ type: "OPEN_AUTH_MODAL", payload: "signin" })
          }
        >
          Sign In
        </button>
      </div>
    );
  }

  if (state.orders.length === 0)
    return (
      <div className="empty-page">
        <Package size={64} strokeWidth={1} />
        <h2>{t("noOrdersYet")}</h2>
        <p>{t("purchasedKeysHere")}</p>
        <Link to="/games" className="btn btn-primary">
          {t("browseGames")}
        </Link>
      </div>
    );

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {state.orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id">{order.id}</span>
                <span className="order-date">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span className="order-total">{formatPrice(order.total)}</span>
            </div>

            {/* Status badge for crypto orders */}
            {order.status === "pending_crypto" && (
              <div className="order-status-banner pending">
                <Clock size={16} />
                <div className="order-status-banner-content">
                  <span>
                    {t("awaitingCryptoPayment")}
                  </span>
                  <CryptoCountdown
                    orderDate={order.date}
                    orderId={order.id}
                    onExpired={handleExpired}
                  />
                </div>
              </div>
            )}
            {order.status === "rejected" && (
              <div className="order-status-banner rejected">
                <XCircle size={16} /> {t("paymentNotReceived")}
              </div>
            )}

            <div className="order-items">
              {(order.keys || []).length === 0 && order.status === "pending_crypto" ? (
                <div className="order-crypto-details">
                  {/* Game names */}
                  {order.items && order.items.length > 0 && (
                    <div className="order-crypto-games">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-crypto-game-row">
                          <span className="order-crypto-game-name">{item.title}</span>
                          <span className="order-crypto-game-qty">×{item.qty || 1}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="order-pending-msg">
                    <Clock size={18} />
                    <div className="order-pending-info">
                      <span>{t("pendingCryptoKeys")}</span>
                      <span className="order-pending-warning">{t("cryptoAutoReject")}</span>
                    </div>
                  </div>

                  {order.crypto_details && (
                    <div className="order-crypto-payment-info">
                      <div className="order-crypto-header">
                        <div className="order-crypto-field">
                          <span className="order-crypto-label">CRYPTO:</span>
                          <span className="order-crypto-badge">
                            {order.crypto_details.crypto}
                          </span>
                        </div>
                        <div className="order-crypto-field">
                          <span className="order-crypto-label">NETWORK:</span>
                          <span className="order-crypto-network-badge">
                            {order.crypto_details.network}
                          </span>
                        </div>
                      </div>
                      {order.crypto_details.address && (
                        <div className="order-crypto-address-section">
                          <div className="order-crypto-address-col">
                            <div className="order-crypto-address-box">
                              <code>{order.crypto_details.address}</code>
                            </div>
                            <button
                              className="order-crypto-copy-btn"
                              onClick={() => copyAddress(order.id, order.crypto_details.address)}
                            >
                              {copiedAddress === order.id ? <Check size={14} /> : <Copy size={14} />}
                              {copiedAddress === order.id ? (t("copied") || "Copied!") : (t("copyAddress") || "Copy Address")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (order.keys || []).length === 0 && order.status === "rejected" ? (
                <div className="order-pending-msg rejected-msg">
                  <XCircle size={18} />
                  <span>{t("orderCancelledNoPayment")}</span>
                </div>
              ) : (order.keys || []).map((k, idx) => {
                const visible = visibleKeys[`${order.id}-${idx}`];
                return (
                  <div key={idx} className="order-key-row">
                    <span className="order-game-name">{k.game}</span>
                    <div className="key-display">
                      <code>{visible ? k.key : "XXXX-XXXX-XXXX-XXXX"}</code>
                      <button
                        className="icon-btn-sm"
                        title={visible ? "Hide Key" : "View Key"}
                        onClick={() => toggleKey(order.id, idx)}
                      >
                        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      {visible && (
                        <button
                          className="icon-btn-sm"
                          title="Copy Key"
                          onClick={() => copyKey(k.key)}
                        >
                          <ClipboardCopy size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
