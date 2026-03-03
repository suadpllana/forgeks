import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormatPrice } from "../context/StoreContext";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function PayPalCheckout({ total, onSuccess, onCancel }) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const [error, setError] = useState("");

  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onCancel}>
            <X size={20} />
          </button>
          <h2>{t("payWithPaypal")}</h2>
          <p className="payment-error">
            PayPal is not configured. Please set the VITE_PAYPAL_CLIENT_ID environment variable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          <X size={20} />
        </button>
        <h2>{t("payWithPaypal")}</h2>
        <p className="payment-total">{formatPrice(total)}</p>
        <p className="payment-currency-note" style={{ fontSize: "0.78rem", opacity: 0.6, marginTop: "-6px" }}>Charged in USD</p>

        {error && <p className="payment-error">{error}</p>}

        <PayPalScriptProvider
          options={{
            "client-id": PAYPAL_CLIENT_ID,
            currency: "USD",
            intent: "capture",
            "disable-funding": "credit,card",
          }}
        >
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
              height: 45,
            }}
            createOrder={async () => {
              try {
                setError("");
                // Call Netlify serverless function to create the order server-side
                const res = await fetch("/.netlify/functions/paypal-create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ total }),
                });
                const text = await res.text();
                let data;
                try {
                  data = JSON.parse(text);
                } catch {
                  console.error("Non-JSON response from create-order:", text);
                  throw new Error(t("paymentFailed"));
                }
                if (!res.ok || !data.id) {
                  const errMsg = data.error || t("paymentFailed");
                  setError(errMsg);
                  throw new Error(errMsg);
                }
                return data.id;
              } catch (err) {
                setError(err.message || t("paymentFailed"));
                throw err;
              }
            }}
            onApprove={async (data) => {
              try {
                // Call Netlify serverless function to capture the order server-side
                const res = await fetch("/.netlify/functions/paypal-capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderID: data.orderID }),
                });
                const text = await res.text();
                let details;
                try {
                  details = JSON.parse(text);
                } catch {
                  console.error("Non-JSON response from capture-order:", text);
                  setError(t("paymentFailed"));
                  return;
                }
                if (res.ok && details.status === "COMPLETED") {
                  onSuccess(details);
                } else {
                  setError(details.error || t("paymentFailed"));
                }
              } catch (err) {
                setError(t("paymentFailed"));
              }
            }}
            onError={(err) => {
              console.error("PayPal error:", err);
              setError(t("paymentFailed"));
            }}
            onCancel={() => {
              onCancel();
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
