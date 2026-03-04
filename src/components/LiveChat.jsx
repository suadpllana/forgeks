import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader, MinimizeIcon, Bot, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useStore } from "../context/StoreContext";

// ── AI auto-reply engine ──────────────────────────────────────────
const AUTO_REPLIES = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "sup", "yo"],
    reply:
      "Hey there! 👋 Welcome to Forge Ks support. How can I help you today? I can assist with orders, game keys, payments, refunds, and more.",
  },
  {
    keywords: ["order", "orders", "my order", "placed order"],
    reply:
      "You can view all your orders in the **My Orders** section. Each order shows your game keys and status. If there's an issue with a specific order, please share your Order ID here and I'll escalate it to our team!",
  },
  {
    keywords: ["key", "game key", "activation", "code", "activate", "redeem"],
    reply:
      "Game keys are delivered **instantly** to your Orders page after a successful payment. Go to **My Orders → View Order** to see your key. If you're having trouble, let me know your Order ID and I'll get it sorted!",
  },
  {
    keywords: ["refund", "money back", "return", "cancel", "chargeback"],
    reply:
      "We offer refunds within **48 hours** of purchase for unused keys. Please visit our **Refund Policy** page for full details. If you want to request a refund, share your Order ID and email address here and our team will process it shortly.",
  },
  {
    keywords: ["paypal", "payment", "pay", "checkout", "billing"],
    reply:
      "We accept **PayPal** and **cryptocurrency** payments. PayPal orders are confirmed instantly. If your payment failed, please try again or contact PayPal support. Crypto payments can take 10–30 minutes to verify.",
  },
  {
    keywords: ["crypto", "bitcoin", "eth", "ethereum", "usdt", "btc", "pending"],
    reply:
      "Crypto orders are marked **Pending** until we verify the blockchain transaction (usually 10–30 minutes). Once confirmed, your game keys will appear in My Orders automatically. If it's been over an hour, share your txid here!",
  },
  {
    keywords: ["price", "discount", "sale", "coupon", "promo", "code", "cheaper", "deal"],
    reply:
      "We regularly run sales and promo codes! 🎮 Keep an eye on the homepage for current deals. If you have a discount code, it can be applied at checkout. Is there a specific game you're looking for?",
  },
  {
    keywords: ["account", "login", "sign in", "password", "forgot", "reset"],
    reply:
      "If you forgot your password, use the **Forgot Password** option on the login screen. For other account issues like email changes, let me know and I'll escalate to our admin team right away.",
  },
  {
    keywords: ["hack", "stolen", "unauthorized", "security", "breach", "compromised"],
    reply:
      "⚠️ This sounds urgent! Please **change your password immediately** and then share your account email here. Our security team will review your account within 1–2 hours and reach out to you.",
  },
  {
    keywords: ["gift card", "gift cards", "psn", "steam", "pc gift"],
    reply:
      "We sell **PlayStation** and **Steam** gift cards! Head to the **Gift Cards** section to browse denominations. Keys are delivered instantly after purchase.",
  },
  {
    keywords: ["not working", "broken", "bug", "error", "issue", "problem", "wrong"],
    reply:
      "Sorry to hear that! 😔 Please describe the issue in more detail (what page, what happened, error message if any) and I'll make sure our team looks into it immediately.",
  },
  {
    keywords: ["shipping", "delivery", "download", "digital", "physical"],
    reply:
      "All our products are **100% digital**. There's no shipping — game keys and gift cards are delivered instantly to your account after purchase.",
  },
  {
    keywords: ["contact", "support", "agent", "human", "person", "real person", "talk to someone", "admin"],
    reply:
      "Okay, I’ll connect you to a real support agent now. An admin will reply here in this chat shortly — once they join, I’ll stay quiet so you can talk directly with them. You can also reach us at **support@forgeks.com** if you prefer email.",
  },
  {
    keywords: ["thanks", "thank you", "thx", "ty", "great", "awesome", "perfect", "solved"],
    reply:
      "You're welcome! 😊 Is there anything else I can help you with? If your issue is resolved, feel free to close this chat. Have a great gaming session!",
  },
  {
    keywords: ["bye", "goodbye", "see you", "ciao", "later"],
    reply: "Goodbye! 👋 Feel free to reach out anytime if you have more questions. Happy gaming! 🎮",
  },
];

const DEFAULT_REPLY =
  "Thanks for reaching out! 🎮 Your message has been received and a member of our support team will respond shortly. In the meantime, feel free to check our **Help Center** for quick answers.";

function getAutoReply(message) {
  const lower = message.toLowerCase();
  for (const rule of AUTO_REPLIES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.reply;
    }
  }
  return DEFAULT_REPLY;
}

// Render simple **bold** markdown
function renderContent(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function LiveChat() {
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [newCount, setNewCount] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const channelRef = useRef(null);
  // Tracks whether a real admin has replied — if so, bot stays silent
  const adminEngagedRef = useRef(false);

  // On open: init session or load existing
  useEffect(() => {
    if (!open) return;
    setNewCount(0);
    initSession();
    if (inputRef.current) inputRef.current.focus();
  }, [open]);

  // When the authenticated user changes (login, logout, or account switch),
  // tear down the current chat session so we never show another person's messages.
  // StoreContext already removed `chat_session_id` from localStorage at this point.
  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setMessages([]);
    setSessionId(null);
    setNewCount(0);
    // If the panel is already open, immediately start a fresh session for the new user
    if (open) initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Once an admin message appears in this session, suppress the bot permanently
  useEffect(() => {
    if (messages.some((m) => m.sender === "admin")) {
      adminEngagedRef.current = true;
    }
  }, [messages]);

  // Real-time subscription to admin replies
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`chat_messages_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const msg = payload.new;
          if (msg.sender === "admin") {
            setMessages((prev) => {
              // avoid duplicates
              if (prev.find((m) => m.id === msg.id)) return prev;
              return [...prev, { id: msg.id, sender: "admin", content: msg.content, created_at: msg.created_at }];
            });
            if (!open) setNewCount((c) => c + 1);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, open]);

  async function initSession() {
    // Try localStorage session id first
    const storedId = localStorage.getItem("chat_session_id");
    if (storedId) {
      // Load messages for existing session
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", storedId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            sender: m.sender,
            content: m.content,
            created_at: m.created_at,
          }))
        );
        setSessionId(storedId);
        return;
      }
    }

    // Create new session
    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: state.user?.id || null,
        user_email: state.user?.email || null,
        user_name: state.user?.name || "Guest",
        status: "open",
      })
      .select()
      .single();

    if (!error && session) {
      localStorage.setItem("chat_session_id", session.id);
      setSessionId(session.id);

      // Insert welcome message
      const welcome = {
        session_id: session.id,
        sender: "bot",
        content:
          "👋 Hi! I'm the Forge Ks support bot. Type your question below and I'll do my best to help, or a team member will jump in!",
      };
      const { data: wMsg } = await supabase.from("chat_messages").insert(welcome).select().single();
      if (wMsg) {
        setMessages([{ id: wMsg.id, sender: "bot", content: wMsg.content, created_at: wMsg.created_at }]);
      }
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !sessionId) return;

    setInput("");
    setSending(true);

    // Insert user message
    const { data: userMsg } = await supabase
      .from("chat_messages")
      .insert({ session_id: sessionId, sender: "user", content: text })
      .select()
      .single();

    if (userMsg) {
      setMessages((prev) => [
        ...prev,
        { id: userMsg.id, sender: "user", content: userMsg.content, created_at: userMsg.created_at },
      ]);
    }

    // Update session updated_at & ensure user info is stored
    await supabase
      .from("chat_sessions")
      .update({
        user_id: state.user?.id || null,
        user_email: state.user?.email || null,
        user_name: state.user?.name || "Guest",
        status: "open",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    // Auto AI reply after short delay — only when no admin has engaged yet
    setTimeout(async () => {
      if (adminEngagedRef.current) {
        // Admin is handling this session — bot stays silent
        setSending(false);
        return;
      }
      const reply = getAutoReply(text);
      const { data: botMsg } = await supabase
        .from("chat_messages")
        .insert({ session_id: sessionId, sender: "bot", content: reply })
        .select()
        .single();
      if (botMsg) {
        setMessages((prev) => [
          ...prev,
          { id: botMsg.id, sender: "bot", content: botMsg.content, created_at: botMsg.created_at },
        ]);
      }
      setSending(false);
    }, 700 + Math.random() * 600);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) handleSend(e);
  }

  return (
    <>
      {/* Floating button */}
      <button
        className="live-chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open live chat"
        title="Live Support"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && newCount > 0 && <span className="live-chat-badge">{newCount}</span>}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="live-chat-panel">
          {/* Header */}
          <div className="live-chat-header">
            <div className="live-chat-header-info">
              <div className="live-chat-avatar">
                <Bot size={18} />
              </div>
              <div>
                <strong>Forge Ks Support</strong>
                <span className="live-chat-status">
                  <span className="live-chat-dot" />
                  Online
                </span>
              </div>
            </div>
            <button className="live-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="live-chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`live-chat-msg live-chat-msg--${msg.sender}`}
              >
                {msg.sender !== "user" && (
                  <div className="live-chat-msg-avatar">
                    {msg.sender === "admin" ? <User size={12} /> : <Bot size={12} />}
                  </div>
                )}
                <div className="live-chat-bubble">
                  {msg.sender !== "user" && (
                    <span className={`live-chat-sender-label live-chat-sender-label--${msg.sender}`}>
                      {msg.sender === "admin" ? "🎧 Support Agent" : "🤖 Bot"}
                    </span>
                  )}
                  {renderContent(msg.content)}
                  <span className="live-chat-time">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            {sending && (
              <div className="live-chat-msg live-chat-msg--bot">
                <div className="live-chat-msg-avatar"><Bot size={12} /></div>
                <div className="live-chat-bubble live-chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form className="live-chat-input-row" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              className="live-chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              maxLength={1000}
            />
            <button
              type="submit"
              className="live-chat-send"
              disabled={!input.trim() || sending}
              aria-label="Send"
            >
              {sending ? <Loader size={16} className="spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
