import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Shield size={36} className="legal-icon" />
        <h1>{t("privacyPolicyTitle")}</h1>
        <p className="legal-updated">{t("lastUpdated")} March 2, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            When you create an account or make a purchase on ForgeKs, we collect the following personal
            information:
          </p>
          <ul>
            <li>
              <strong>Account data:</strong> email address, display name, and password (stored securely via
              Supabase Auth).
            </li>
            <li>
              <strong>Transaction data:</strong> purchase history, game keys delivered, and payment method
              type (we do not store full card details — payments are processed by PayPal or your chosen
              crypto wallet).
            </li>
            <li>
              <strong>Usage data:</strong> pages visited, search queries, and device/browser info collected
              anonymously to improve our service.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process and fulfil your orders and deliver game keys.</li>
            <li>To send order confirmations and important account notifications.</li>
            <li>To personalise your experience (e.g., wishlists, order history).</li>
            <li>To detect and prevent fraud or abuse.</li>
            <li>To comply with applicable legal obligations.</li>
          </ul>
          <p>We do <strong>not</strong> sell your personal data to third parties.</p>
        </section>

        <section>
          <h2>3. Data Storage &amp; Security</h2>
          <p>
            Your data is stored on Supabase infrastructure, which uses industry-standard encryption at rest
            and in transit (TLS 1.2+). Access is restricted to authorised personnel only.
          </p>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We do not use tracking or
            advertising cookies. You may disable cookies in your browser settings, but this may affect site
            functionality.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Object to or restrict certain processing activities.</li>
            <li>Data portability (receive a copy of your data in a machine-readable format).</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:privacy@forgeks.com">privacy@forgeks.com</a>.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Services</h2>
          <p>We integrate with the following third-party services:</p>
          <ul>
            <li>
              <strong>Supabase</strong> — database and authentication (
              <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
              ).
            </li>
            <li>
              <strong>PayPal</strong> — payment processing (
              <a href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
              ).
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes
            via email or a prominent notice on our site.
          </p>
        </section>

        <div className="legal-contact-cta">
          <p>
            Questions about your privacy?{" "}
            <Link to="/contact">Contact us</Link> — we're happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}
