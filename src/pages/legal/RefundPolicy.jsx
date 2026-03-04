import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RefundPolicy() {
  const { t } = useTranslation();
  return (
    <div className="legal-page">
      <div className="legal-header">
        <RotateCcw size={36} className="legal-icon" />
        <h1>{t("refundPolicyTitle")}</h1>
        <p className="legal-updated">{t("lastUpdated")} March 2, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Overview</h2>
          <p>
            All purchases on ForgeKs are for <strong>digital game keys</strong> delivered instantly after
            payment. Due to the nature of digital goods, we have a strict but fair refund policy.
          </p>
        </section>

        <section>
          <h2>Eligible Refunds</h2>
          <p>You are eligible for a full refund if:</p>
          <ul>
            <li>Your game key is <strong>invalid or already used</strong> at the time of delivery.</li>
            <li>The product you received is <strong>not the one you ordered</strong>.</li>
            <li>
              You have <strong>not yet revealed or copied</strong> the game key shown in your order details.
            </li>
            <li>You contact us within <strong>14 days</strong> of purchase.</li>
          </ul>
        </section>

        <section>
          <h2>Non-Eligible Refunds</h2>
          <p>Refunds will <strong>not</strong> be granted if:</p>
          <ul>
            <li>The game key has already been revealed, copied, or redeemed.</li>
            <li>You changed your mind after the key was delivered.</li>
            <li>The request is made more than 14 days after purchase.</li>
            <li>The issue is related to your device's compatibility or region lock — please check platform requirements before purchasing.</li>
          </ul>
        </section>

        <section>
          <h2>How to Request a Refund</h2>
          <ol>
            <li>
              Go to <Link to="/orders">My Orders</Link> and locate the order in question.
            </li>
            <li>
              Contact us via our <Link to="/contact">Contact page</Link> or email{" "}
              <a href="mailto:support@forgeks.com">support@forgeks.com</a> with:
              <ul>
                <li>Your order ID</li>
                <li>The game title</li>
                <li>A description of the issue</li>
              </ul>
            </li>
            <li>Our team will review your request within <strong>1–2 business days</strong>.</li>
          </ol>
        </section>

        <section>
          <h2>Refund Method</h2>
          <p>
            Approved refunds are issued to your original payment method (PayPal) within 3–5 business days,
            depending on your payment provider.
          </p>
        </section>

        <section>
          <h2>Gift Cards</h2>
          <p>
            Gift card purchases are <strong>non-refundable</strong> once the code has been revealed or
            redeemed.
          </p>
        </section>

        <div className="legal-contact-cta">
          <p>
            Need help with a refund?{" "}
            <Link to="/contact">Contact our support team</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
