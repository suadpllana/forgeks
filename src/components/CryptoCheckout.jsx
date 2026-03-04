import { useState, useEffect } from "react";
import { X, Copy, Check, Bitcoin, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormatPrice } from "../context/StoreContext";

// ── Crypto definitions with networks ────────────────────────────
const CRYPTO_OPTIONS = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    coingeckoId: "bitcoin",
    icon: "₿",
    color: "#f7931a",
    networks: [
      { id: "btc", name: "Bitcoin", tag: "BTC", address: "bc1q6l4638eh0nqds98eake4683wnj9vjnyzg8u6jn" },
    ],
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    coingeckoId: "ethereum",
    icon: "Ξ",
    color: "#627eea",
    networks: [
      { id: "erc20", name: "Ethereum", tag: "ERC-20", address: "0x3B16ED377361488364349c0a1E04440C92A9A24d" },
      { id: "polygon", name: "Polygon", tag: "Polygon", address: "0x3B16ED377361488364349c0a1E04440C92A9A24d" },
    ],
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    coingeckoId: "tether",
    icon: "₮",
    color: "#26a17b",
    networks: [
      { id: "trc20", name: "Tron", tag: "TRC-20", address: "TKfC7nqU9i2wFijrR57yXPma6CxmVyHce2" },
      { id: "erc20", name: "Ethereum", tag: "ERC-20", address: "0x3B16ED377361488364349c0a1E04440C92A9A24d" },
      { id: "bep20", name: "BNB Smart Chain", tag: "BEP-20", address: "0x3B16ED377361488364349c0a1E04440C92A9A24d" },
      { id: "polygon", name: "Polygon", tag: "Polygon", address: "0x3B16ED377361488364349c0a1E04440C92A9A24d" },
      { id: "arbitrum", name: "Arbitrum One", tag: "Arbitrum", address: "0x3B16ED377361488364349c0a1E04440C92A9A24d" },
      { id: "solana", name: "Solana", tag: "SPL", address: "Hbd8prkjm3ARkrr8vca21qnjdAQVBC2V4mSA9QbSxitF" },
    ],
  },
  {
    id: "ltc",
    name: "Litecoin",
    symbol: "LTC",
    coingeckoId: "litecoin",
    icon: "Ł",
    color: "#bfbbbb",
    networks: [
      { id: "ltc", name: "Litecoin", tag: "LTC", address: "ltc1qj5tn40ah4s55h9770sdh8kw0xlq93k6al3csyh" },
    ],
  },
];

// ── CoinGecko price fetch ───────────────────────────────────────
async function fetchCryptoPrice(coingeckoId) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`
    );
    const data = await res.json();
    return data[coingeckoId]?.usd ?? null;
  } catch {
    return null;
  }
}

// ── Component ───────────────────────────────────────────────────
export default function CryptoCheckout({ total, onSuccess, onCancel }) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();

  // Step: "crypto" → "network" → "pay"
  const [step, setStep] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Live price conversion
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // Fetch price when a crypto is selected
  useEffect(() => {
    if (!selectedCrypto) return;
    let cancelled = false;
    fetchCryptoPrice(selectedCrypto.coingeckoId).then((price) => {
      if (!cancelled) {
        setCryptoPrice(price);
        setPriceLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [selectedCrypto]);

  const cryptoAmount =
    cryptoPrice && cryptoPrice > 0 ? (total / cryptoPrice).toFixed(8) : null;

  function handleSelectCrypto(crypto) {
    setSelectedCrypto(crypto);
    setPriceLoading(true);
    setCryptoPrice(null);
    // If only one network, skip network selection
    if (crypto.networks.length === 1) {
      setSelectedNetwork(crypto.networks[0]);
      setStep("pay");
    } else {
      setStep("network");
    }
  }

  function handleSelectNetwork(network) {
    setSelectedNetwork(network);
    setStep("pay");
  }

  function handleBack() {
    if (step === "pay" && selectedCrypto?.networks.length > 1) {
      setSelectedNetwork(null);
      setStep("network");
    } else {
      setSelectedCrypto(null);
      setSelectedNetwork(null);
      setCryptoPrice(null);
      setStep("crypto");
    }
  }

  function handleCopy(address) {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirmPayment() {
    setConfirming(true);
    setTimeout(() => {
      onSuccess({
        method: "crypto",
        crypto: selectedCrypto.symbol,
        cryptoName: selectedCrypto.name,
        network: selectedNetwork.tag,
        networkName: selectedNetwork.name,
        address: selectedNetwork.address,
      });
    }, 1500);
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="payment-modal crypto-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onCancel}>
          <X size={20} />
        </button>

        <h2>
          <Bitcoin size={24} /> {t("cryptoPayment")}
        </h2>
        <p className="payment-total">{formatPrice(total)}</p>

        {/* ── Step 1: Select Cryptocurrency ── */}
        {step === "crypto" && (
          <>
            <p className="crypto-select-label">{t("selectCrypto")}</p>
            <div className="crypto-options">
              {CRYPTO_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  className="crypto-option-btn"
                  onClick={() => handleSelectCrypto(c)}
                  style={{ "--crypto-color": c.color }}
                >
                  <span className="crypto-icon">{c.icon}</span>
                  <span className="crypto-option-label">
                    <span>{c.name}</span>
                    <span className="crypto-option-symbol">{c.symbol}</span>
                  </span>
                  <ChevronRight size={16} className="crypto-chevron" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Step 2: Select Network ── */}
        {step === "network" && selectedCrypto && (
          <>
            <div className="crypto-step-header">
              <button className="crypto-back-btn" onClick={handleBack}>
                <ArrowLeft size={16} />
              </button>
              <span
                className="crypto-icon"
                style={{ color: selectedCrypto.color }}
              >
                {selectedCrypto.icon}
              </span>
              <span className="crypto-step-title">
                {selectedCrypto.name} ({selectedCrypto.symbol})
              </span>
            </div>
            <p className="crypto-select-label">{t("selectNetwork")}</p>
            <div className="crypto-options">
              {selectedCrypto.networks.map((n) => (
                <button
                  key={n.id}
                  className="crypto-option-btn crypto-network-btn"
                  onClick={() => handleSelectNetwork(n)}
                  style={{ "--crypto-color": selectedCrypto.color }}
                >
                  <span className="crypto-network-info">
                    <span className="crypto-network-name">{n.name}</span>
                    <span className="crypto-network-tag">{n.tag}</span>
                  </span>
                  <ChevronRight size={16} className="crypto-chevron" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Step 3: Payment Details ── */}
        {step === "pay" && selectedCrypto && selectedNetwork && (
          <div className="crypto-payment-details">
            <div className="crypto-step-header">
              <button className="crypto-back-btn" onClick={handleBack}>
                <ArrowLeft size={16} />
              </button>
              <span
                className="crypto-icon"
                style={{ color: selectedCrypto.color }}
              >
                {selectedCrypto.icon}
              </span>
              <span className="crypto-step-title">
                {selectedCrypto.symbol}
                <span className="crypto-step-network">
                  {selectedNetwork.tag}
                </span>
              </span>
            </div>

            <p className="crypto-send-label">{t("sendExactAmount")}</p>

            <div className="crypto-amount-box">
              <span
                className="crypto-symbol"
                style={{ color: selectedCrypto.color }}
              >
                {selectedCrypto.icon}
              </span>
              <div className="crypto-amount-info">
                {priceLoading ? (
                  <span className="crypto-amount-loading">
                    <Loader2 size={16} className="spin" /> {t("fetchingPrice")}
                  </span>
                ) : cryptoAmount ? (
                  <>
                    <span className="crypto-amount-value">
                      {cryptoAmount} {selectedCrypto.symbol}
                    </span>
                    <span className="crypto-amount-usd">
                      ≈ {formatPrice(total)}
                    </span>
                  </>
                ) : (
                  <span className="crypto-amount-value">
                    {formatPrice(total)} {t("inCrypto")} {selectedCrypto.symbol}
                  </span>
                )}
              </div>
            </div>

            <div className="crypto-address-section">
              <label>
                {t("cryptoAddress")} ({selectedNetwork.tag})
              </label>
              <div className="crypto-address-col">
                <div className="crypto-address-box">
                  <code>{selectedNetwork.address}</code>
                </div>
                <button
                  className="crypto-copy-btn"
                  onClick={() => handleCopy(selectedNetwork.address)}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? t("copied") : t("copyAddress")}
                </button>
              </div>
            </div>

            <p className="crypto-note">
              ⚠️ {t("networkWarning", { network: selectedNetwork.tag })}
            </p>

            <div className="crypto-actions">
              <button
                className="btn btn-primary full-width"
                onClick={handleConfirmPayment}
                disabled={confirming}
              >
                {confirming ? t("placingOrder") : t("iHavePaid")}
              </button>
              <button
                className="btn btn-outline full-width"
                onClick={handleBack}
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
