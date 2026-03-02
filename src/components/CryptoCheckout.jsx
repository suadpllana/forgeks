import { useState } from "react";
import { X, Copy, Check, Bitcoin } from "lucide-react";
import { useTranslation } from "react-i18next";

const CRYPTO_OPTIONS = [
  {
    id: "btc",
    name: "Bitcoin (BTC)",
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    icon: "₿",
    color: "#f7931a",
  },
  {
    id: "eth",
    name: "Ethereum (ETH)",
    symbol: "ETH",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD30",
    icon: "Ξ",
    color: "#627eea",
  },
  {
    id: "usdt",
    name: "Tether (USDT)",
    symbol: "USDT",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD30",
    icon: "₮",
    color: "#26a17b",
  },
  {
    id: "ltc",
    name: "Litecoin (LTC)",
    symbol: "LTC",
    address: "ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
    icon: "Ł",
    color: "#bfbbbb",
  },
];

export default function CryptoCheckout({ total, onSuccess, onCancel }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function handleCopy(address) {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirmPayment() {
    setConfirming(true);
    // Simulate verification delay
    setTimeout(() => {
      onSuccess({ method: "crypto", crypto: selected.symbol });
    }, 1500);
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="payment-modal crypto-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          <X size={20} />
        </button>
        <h2>
          <Bitcoin size={24} /> {t("cryptoPayment")}
        </h2>
        <p className="payment-total">${total.toFixed(2)}</p>

        {!selected ? (
          <>
            <p className="crypto-select-label">{t("selectCrypto")}</p>
            <div className="crypto-options">
              {CRYPTO_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  className="crypto-option-btn"
                  onClick={() => setSelected(c)}
                  style={{ "--crypto-color": c.color }}
                >
                  <span className="crypto-icon">{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="crypto-payment-details">
            <p className="crypto-send-label">{t("sendExactAmount")}</p>
            <div className="crypto-amount-box">
              <span className="crypto-symbol" style={{ color: selected.color }}>
                {selected.icon}
              </span>
              <span className="crypto-amount-value">${total.toFixed(2)} in {selected.symbol}</span>
            </div>

            <div className="crypto-address-section">
              <label>{t("cryptoAddress")}</label>
              <div className="crypto-address-box">
                <code>{selected.address}</code>
                <button
                  className="crypto-copy-btn"
                  onClick={() => handleCopy(selected.address)}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? t("copied") : t("copyAddress")}
                </button>
              </div>
            </div>

            <p className="crypto-note">{t("cryptoNote")}</p>

            <div className="crypto-actions">
              <button
                className="btn btn-primary full-width"
                onClick={handleConfirmPayment}
                disabled={confirming}
              >
                {confirming ? t("paypalProcessing") : t("iHavePaid")}
              </button>
              <button
                className="btn btn-outline full-width"
                onClick={() => setSelected(null)}
              >
                {t("back")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
