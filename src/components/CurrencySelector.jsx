import { useStore } from "../context/StoreContext";

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "GBP", symbol: "£", label: "GBP" },
];

export default function CurrencySelector() {
  const { state, dispatch } = useStore();
  const current = state.currency || "USD";

  return (
    <div className="currency-selector" title="Select currency">
      <select
        value={current}
        onChange={(e) => {
          dispatch({ type: "SET_CURRENCY", payload: e.target.value });
          localStorage.setItem("preferred_currency", e.target.value);
        }}
        aria-label="Select currency"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
