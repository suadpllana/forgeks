import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, EyeOff, ClipboardCopy } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Orders() {
  const { state, dispatch } = useStore();
  const [visibleKeys, setVisibleKeys] = useState({});

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
        <h2>Sign in to view your orders</h2>
        <p>Your digital keys will appear here after purchase.</p>
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
        <h2>No orders yet</h2>
        <p>Your purchased game keys will appear here.</p>
        <Link to="/games" className="btn btn-primary">
          Browse Games
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
              <span className="order-total">${order.total.toFixed(2)}</span>
            </div>
            <div className="order-items">
              {order.keys.map((k, idx) => {
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
