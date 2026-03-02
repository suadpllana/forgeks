import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <FileText size={36} className="legal-icon" />
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: March 2, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or purchasing from Forge Ks, you agree to these Terms of Service and
            our <Link to="/privacy-policy">Privacy Policy</Link>. If you do not agree, please do not use our
            services.
          </p>
        </section>

        <section>
          <h2>2. Digital Products</h2>
          <p>
            Forge Ks sells digital game keys and gift cards for personal, non-commercial use only. All
            products are delivered electronically. Keys may not be resold, transferred, or distributed
            without our prior written consent.
          </p>
        </section>

        <section>
          <h2>3. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activity under your account. Notify us immediately at{" "}
            <a href="mailto:support@forgeks.com">support@forgeks.com</a> if you suspect unauthorised access.
          </p>
        </section>

        <section>
          <h2>4. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Attempt to resell or redistribute purchased game keys.</li>
            <li>Use automated tools to scrape, harvest, or bulk-purchase products.</li>
            <li>Engage in fraudulent chargebacks or payment disputes without first contacting our support.</li>
            <li>Circumvent any security or access controls on the platform.</li>
          </ul>
          <p>Violations may result in account suspension and legal action.</p>
        </section>

        <section>
          <h2>5. Refunds</h2>
          <p>
            Please see our <Link to="/refund-policy">Refund Policy</Link> for full details on eligibility
            and the refund process.
          </p>
        </section>

        <section>
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            Forge Ks provides the platform "as is" without warranties of any kind. We do not guarantee
            uninterrupted availability and are not liable for any indirect, incidental, or consequential
            damages arising from the use of our service.
          </p>
        </section>

        <section>
          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Continued use of the service after
            changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            Questions about these Terms?{" "}
            <Link to="/contact">Contact us</Link> or email{" "}
            <a href="mailto:legal@forgeks.com">legal@forgeks.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
