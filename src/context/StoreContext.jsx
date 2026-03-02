import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";

const StoreContext = createContext();

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
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (!error && data) {
    const mapped = data.map((o) => ({
      id: o.id,
      items: o.items,
      total: o.total,
      date: o.created_at,
      keys: o.keys,
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

export async function placeOrderDB(cart, discountAmount = 0, paymentMethod = "direct") {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - discountAmount);
  const keys = cart.map((i) => ({
    game: i.title,
    key: `XXXX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
  }));
  const { data, error } = await supabase
    .from("orders")
    .insert({ items: cart, total, keys, payment_method: paymentMethod })
    .select()
    .single();
  if (error) return { error };

  // Send order notification to user
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "order",
      title: "Order Confirmed!",
      message: `Your order of $${total.toFixed(2)} has been placed. ${keys.length} game key(s) are ready.`,
    });
  }

  return {
    order: {
      id: data.id,
      items: data.items,
      total: data.total,
      date: data.created_at,
      keys: data.keys,
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
