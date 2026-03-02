import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How quickly do I receive my game key?",
        a: "Game keys are delivered instantly to your account after a successful payment. Go to My Orders to view and copy your key. You will also receive an in-app notification.",
      },
      {
        q: "Where do I find my game key?",
        a: "Navigate to My Orders (top-right menu → My Orders) and click on your order. Your game key(s) will be displayed there.",
      },
      {
        q: "My game key is not working. What do I do?",
        a: "First, make sure you are redeeming the key on the correct platform. If the key is genuinely invalid, please contact our support team — we will verify and replace it or issue a refund.",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled before the game key is revealed. Once the key is shown in your order, it cannot be cancelled. Please review your purchase carefully before checking out.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept PayPal and selected cryptocurrencies. More payment methods may be added in the future.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. We do not store your card or payment details. All payments are processed through PayPal's secure infrastructure or directly on-chain for crypto.",
      },
      {
        q: "I was charged but didn't receive a key. What should I do?",
        a: "Please check your My Orders page first — the key may already be there. If not, contact us with your transaction ID and we will resolve it within 24 hours.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "How do I create an account?",
        a: "Click the Sign In button in the top navigation bar, then select Create Account. You can register with your email address.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click Sign In, then click 'Forgot password?' and enter your email address. You will receive a password reset link shortly.",
      },
      {
        q: "How do I update my profile information?",
        a: "Go to your Profile page (top-right user menu → Profile) to update your display name and other account settings.",
      },
    ],
  },
  {
    category: "Games & Platforms",
    items: [
      {
        q: "Are all games region-free?",
        a: "Most game keys are global/multi-region. Where a key is region-locked, this is clearly stated on the product page. Always check before purchasing.",
      },
      {
        q: "How do I redeem a Steam key?",
        a: "Open the Steam client, click on Games in the menu bar, then Activate a Product on Steam. Enter your key and follow the on-screen instructions.",
      },
      {
        q: "How do I redeem a PlayStation key?",
        a: "On your PS5 or PS4, navigate to the PlayStation Store, scroll down to Redeem Codes, enter your code and confirm.",
      },
    ],
  },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setOpen((o) => !o)}>
        <span>{item.q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="faq-answer">{item.a}</div>}
    </div>
  );
}

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="legal-page help-center-page">
      <div className="legal-header">
        <HelpCircle size={36} className="legal-icon" />
        <h1>Help Center</h1>
        <p>Find answers to the most common questions below.</p>
      </div>

      <div className="help-center-content">
        <div className="faq-categories">
          {faqs.map((cat) => (
            <button
              key={cat.category}
              className={`faq-cat-btn ${activeCategory === cat.category || activeCategory === null ? "active" : ""}`}
              onClick={() =>
                setActiveCategory((prev) => (prev === cat.category ? null : cat.category))
              }
            >
              {cat.category}
            </button>
          ))}
          <button
            className={`faq-cat-btn ${activeCategory === null ? "active" : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
        </div>

        <div className="faq-list">
          {faqs
            .filter((cat) => !activeCategory || cat.category === activeCategory)
            .map((cat) => (
              <div key={cat.category} className="faq-section">
                <h2 className="faq-category-title">{cat.category}</h2>
                {cat.items.map((item) => (
                  <FaqItem key={item.q} item={item} />
                ))}
              </div>
            ))}
        </div>

        <div className="legal-contact-cta">
          <p>
            Couldn't find an answer?{" "}
            <Link to="/contact">Contact our support team</Link> — we usually respond within a few hours.
          </p>
        </div>
      </div>
    </div>
  );
}
