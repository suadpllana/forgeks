import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { supabase } from "../lib/supabase";

const StoreContext = createContext();

// ── Exchange rates (relative to USD) ────────────────────────────
const EXCHANGE_RATES = { USD: 1, EUR: 0.93, GBP: 0.79 };
const CURRENCY_SYMBOLS = { USD: "$", EUR: "€", GBP: "£" };

const initialState = {
  games: [],
  giftCards: [],
  gamesLoading: true,
  cart: [],
  wishlist: [],
  orders: [],
  user: null,
  loading: true,
  searchQuery: "",
  authModalOpen: false,
  authMode: "signin", // signin | register
  currency: localStorage.getItem("preferred_currency") || "USD",
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cart.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, qty: 1 }] };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
      };
    case "UPDATE_QTY":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "SET_GAMES":
      return { ...state, games: action.payload, gamesLoading: false };
    case "SET_GIFT_CARDS":
      return { ...state, giftCards: action.payload };
    case "SET_WISHLIST":
      return { ...state, wishlist: action.payload };
    case "TOGGLE_WISHLIST": {
      const inList = state.wishlist.find((i) => i.id === action.payload.id);
      return {
        ...state,
        wishlist: inList
          ? state.wishlist.filter((i) => i.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      };
    }
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders], cart: [] };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGOUT":
      return { ...state, user: null, wishlist: [], orders: [] };
    case "OPEN_AUTH_MODAL":
      return {
        ...state,
        authModalOpen: true,
        authMode: action.payload || "signin",
      };
    case "CLOSE_AUTH_MODAL":
      return { ...state, authModalOpen: false };
    case "SET_CURRENCY":
      return { ...state, currency: action.payload };
    default:
      return state;
  }
}

// ── Supabase helpers ─────────────────────────────────────────────

async function fetchGames(dispatch) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("id", { ascending: true });
  if (!error && data) {
    // Map snake_case DB columns to camelCase used by the UI
    const mapped = data.map((g) => ({
      id: g.id,
      title: g.title,
      slug: g.slug,
      price: Number(g.price),
      originalPrice: Number(g.original_price),
      discount: g.discount,
      platform: g.platform,
      category: g.category,
      rating: Number(g.rating),
      reviews: g.reviews,
      releaseDate: g.release_date,
      isNew: g.is_new,
      isTrending: g.is_trending,
      onSale: g.on_sale,
      publisher: g.publisher,
      developer: g.developer,
      description: g.description,
      features: g.features,
      image: g.image,
      banner: g.banner,
      screenshots: g.screenshots,
    }));
    dispatch({ type: "SET_GAMES", payload: mapped });
  } else {
    dispatch({ type: "SET_GAMES", payload: [] });
  }
}

async function fetchGiftCards(dispatch) {
  const { data, error } = await supabase
    .from("gift_cards")
    .select("*")
    .order("id", { ascending: true });
  if (!error && data) {
    dispatch({ type: "SET_GIFT_CARDS", payload: data });
  }
}

async function fetchWishlist(dispatch) {
  const { data, error } = await supabase
    .from("wishlist")
    .select("game_id, games(*)")
    .order("created_at", { ascending: false });
  if (!error && data) {
    const mapped = data
      .filter((r) => r.games)
      .map((r) => ({
        id: r.games.id,
        title: r.games.title,
        slug: r.games.slug,
        price: Number(r.games.price),
        originalPrice: Number(r.games.original_price),
        discount: r.games.discount,
        platform: r.games.platform,
        category: r.games.category,
        rating: Number(r.games.rating),
        reviews: r.games.reviews,
        releaseDate: r.games.release_date,
        isNew: r.games.is_new,
        isTrending: r.games.is_trending,
        onSale: r.games.on_sale,
        publisher: r.games.publisher,
        developer: r.games.developer,
        description: r.games.description,
        features: r.games.features,
        image: r.games.image,
        banner: r.games.banner,
        screenshots: r.games.screenshots,
      }));
    dispatch({ type: "SET_WISHLIST", payload: mapped });
  }
}

async function fetchOrders(dispatch) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (!error && data) {
    const mapped = data.map((o) => ({
      id: o.id,
      items: o.items,
      total: o.total,
      date: o.created_at,
      keys: o.keys,
      status: o.status || "completed",
      payment_method: o.payment_method,
      crypto_details: o.crypto_details || null,
    }));
    dispatch({ type: "SET_ORDERS", payload: mapped });
  }
}

export async function addToWishlistDB(game) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Error("Not authenticated");
  const { error } = await supabase
    .from("wishlist")
    .insert({ user_id: user.id, game_id: game.id });
  return error;
}

export async function removeFromWishlistDB(gameId) {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("game_id", gameId);
  return error;
}

export async function placeOrderDB(
  cart,
  discountAmount = 0,
  paymentMethod = "direct",
  cryptoDetails = null,
  options = {}
) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - discountAmount);
  const isCrypto = paymentMethod === "crypto";

  const selectedPlatforms = options.selectedPlatforms || {};

  // Persist a per-item selected platform so admins can see exactly
  // which platform the user chose at checkout.
  const itemsWithPlatform = cart.map((i) => ({
    ...i,
    selectedPlatform:
      selectedPlatforms[i.id] ||
      (Array.isArray(i.platform) && i.platform.length === 1 ? i.platform[0] : null),
  }));

  // For crypto orders: no keys until admin approves. For others: generate immediately.
  const keys = isCrypto
    ? []
    : cart.map((i) => ({
        game: i.title,
        key: `XXXX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      }));

  const status = isCrypto ? "pending_crypto" : "completed";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: "You must be logged in to place an order." } };

  const insertPayload = {
    user_id: user.id,
    items: itemsWithPlatform,
    total,
    keys,
    payment_method: paymentMethod,
    status,
  };

  if (options.billing) {
    insertPayload.billing = options.billing;
  }
  if (isCrypto && cryptoDetails) {
    insertPayload.crypto_details = cryptoDetails; // { crypto: "BTC", network: "BTC" }
  }

  const { data, error } = await supabase
    .from("orders")
    .insert(insertPayload)
    .select()
    .single();
  if (error) return { error };

  // Send order notification to user
  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "order",
    title: isCrypto ? "Crypto Order Received" : "Order Confirmed!",
    message: isCrypto
      ? `Your crypto order of $${total.toFixed(2)} is pending verification. Keys will be delivered once payment is confirmed.`
      : `Your order of $${total.toFixed(2)} has been placed. ${keys.length} game key(s) are ready.`,
  });

  // Send email notification if user has it enabled
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email_notifications")
      .eq("id", user.id)
      .single();

    if (profile?.email_notifications) {
      fetch("/.netlify/functions/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          orderTotal: total,
          items: cart,
          orderId: data.id,
          type: isCrypto ? "crypto" : "direct",
        }),
      }).catch(() => {}); // fire-and-forget
    }
  } catch (_) {
    // email is non-critical, don't block order
  }

  return {
    order: {
      id: data.id,
      items: data.items,
      total: data.total,
      date: data.created_at,
      keys: data.keys,
      status: data.status,
      payment_method: data.payment_method,
      crypto_details: data.crypto_details || null,
    },
  };
}

// Discount code validation
export async function validateDiscountCode(code) {
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .single();

  if (error || !data) return { valid: false };

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false };
  }

  // Check usage limit
  if (data.max_uses && data.times_used >= data.max_uses) {
    return { valid: false };
  }

  return {
    valid: true,
    discount: {
      id: data.id,
      code: data.code,
      type: data.type, // 'percent' or 'fixed'
      value: Number(data.value),
    },
  };
}

// ── Provider ─────────────────────────────────────────────────────

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch games & gift cards on mount (public, no auth needed)
  useEffect(() => {
    fetchGames(dispatch);
    fetchGiftCards(dispatch);
  }, []);

  // Listen to Supabase auth state changes
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch({
          type: "SET_USER",
          payload: {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0],
            email: session.user.email,
          },
        });
        fetchWishlist(dispatch);
        fetchOrders(dispatch);
      }
      dispatch({ type: "SET_LOADING", payload: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Always clear the chat session when auth state changes (logout or login as
      // a different user) so LiveChat never shows another person's messages.
      localStorage.removeItem("chat_session_id");

      if (session?.user) {
        dispatch({
          type: "SET_USER",
          payload: {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0],
            email: session.user.email,
          },
        });
        fetchWishlist(dispatch);
        fetchOrders(dispatch);
      } else {
        dispatch({ type: "LOGOUT" });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Inactivity auto-logout (1 hour) ───────────────────────────
  const timerRef = useRef(null);
  const INACTIVITY_MS = 60 * 60 * 1000; // 1 hour

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!state.user) return;
    timerRef.current = setTimeout(async () => {
      await supabase.auth.signOut();
      dispatch({ type: "LOGOUT" });
    }, INACTIVITY_MS);
  }, [state.user]);

  useEffect(() => {
    if (!state.user) return;
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.user, resetTimer]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Returns a price formatting function using the current store currency */
export function useFormatPrice() {
  const { state } = useStore();
  const currency = state.currency || "USD";
  const rate = EXCHANGE_RATES[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  return (usdPrice) => `${symbol}${(Number(usdPrice) * rate).toFixed(2)}`;
}

export { EXCHANGE_RATES, CURRENCY_SYMBOLS };
