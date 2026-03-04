import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const privacyCopy = {
  en: {
    sections: [
      {
        title: "1. Information We Collect",
        body: (
          <>
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
          </>
        ),
      },
      {
        title: "2. How We Use Your Information",
        body: (
          <>
            <ul>
              <li>To process and fulfil your orders and deliver game keys.</li>
              <li>To send order confirmations and important account notifications.</li>
              <li>To personalise your experience (e.g., wishlists, order history).</li>
              <li>To detect and prevent fraud or abuse.</li>
              <li>To comply with applicable legal obligations.</li>
            </ul>
            <p>
              We do <strong>not</strong> sell your personal data to third parties.
            </p>
          </>
        ),
      },
      {
        title: "3. Data Storage & Security",
        body: (
          <p>
            Your data is stored on Supabase infrastructure, which uses industry-standard encryption at rest
            and in transit (TLS 1.2+). Access is restricted to authorised personnel only.
          </p>
        ),
      },
      {
        title: "4. Cookies",
        body: (
          <p>
            We use essential cookies for authentication and session management. We do not use tracking or
            advertising cookies. You may disable cookies in your browser settings, but this may affect site
            functionality.
          </p>
        ),
      },
      {
        title: "5. Your Rights",
        body: (
          <>
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
          </>
        ),
      },
      {
        title: "6. Third-Party Services",
        body: (
          <>
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
                <a
                  href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
                ).
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "7. Changes to This Policy",
        body: (
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes
            via email or a prominent notice on our site.
          </p>
        ),
      },
    ],
    cta: (
      <p>
        Questions about your privacy? <Link to="/contact">Contact us</Link> — we're happy to help.
      </p>
    ),
  },
  sq: {
    sections: [
      {
        title: "1. Informacioni që mbledhim",
        body: (
          <>
            <p>
              Kur krijoni një llogari ose bëni një blerje në ForgeKs, ne mbledhim informacionin e mëposhtëm
              personal:
            </p>
            <ul>
              <li>
                <strong>Të dhënat e llogarisë:</strong> adresa e emailit, emri i shfaqur dhe fjalëkalimi
                (ruajtur në mënyrë të sigurt përmes Supabase Auth).
              </li>
              <li>
                <strong>Të dhënat e transaksioneve:</strong> historiku i blerjeve, çelësat e lojërave të
                dorëzuar dhe tipi i mënyrës së pagesës (ne nuk ruajmë të dhënat e plota të kartës – pagesat
                përpunohen nga PayPal ose portofoli juaj i zgjedhur kripto).
              </li>
              <li>
                <strong>Të dhënat e përdorimit:</strong> faqet e vizituara, kërkimet dhe informacioni i
                pajisjes/shfletuesit të mbledhur në mënyrë anonime për të përmirësuar shërbimin.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "2. Si i përdorim informacionet tuaja",
        body: (
          <>
            <ul>
              <li>Për të përpunuar dhe përmbushur porositë tuaja dhe për të dorëzuar çelësat e lojërave.</li>
              <li>Për të dërguar konfirmime porosish dhe njoftime të rëndësishme të llogarisë.</li>
              <li>Për të personalizuar përvojën tuaj (p.sh. lista dëshirash, historiku i porosive).</li>
              <li>Për të zbuluar dhe parandaluar mashtrimet ose abuzimet.</li>
              <li>Për të përmbushur detyrimet ligjore.</li>
            </ul>
            <p>
              Ne <strong>nuk</strong> i shesim të dhënat tuaja personale palëve të treta.
            </p>
          </>
        ),
      },
      {
        title: "3. Ruajtja dhe siguria e të dhënave",
        body: (
          <p>
            Të dhënat tuaja ruhen në infrastrukturën e Supabase, e cila përdor enkriptim sipas standardeve të
            industrisë si gjatë ruajtjes ashtu edhe gjatë transmetimit (TLS 1.2+). Aksesi është i kufizuar
            vetëm për personelin e autorizuar.
          </p>
        ),
      },
      {
        title: "4. Cookies",
        body: (
          <p>
            Ne përdorim vetëm cookies thelbësore për autentikim dhe menaxhim sesioni. Nuk përdorim cookies
            gjurmimi ose reklamuese. Ju mund t'i çaktivizoni cookies në cilësimet e shfletuesit, por kjo mund
            të ndikojë në funksionimin e faqes.
          </p>
        ),
      },
      {
        title: "5. Të drejtat tuaja",
        body: (
          <>
            <p>Në varësi të jurisdiksionit tuaj, ju mund të keni të drejtë të:</p>
            <ul>
              <li>Shihni të dhënat personale që mbajmë për ju.</li>
              <li>Kërkoni korrigjimin ose fshirjen e të dhënave tuaja.</li>
              <li>Kundërshtoni ose kufizoni disa lloje përpunimi.</li>
              <li>
                Përfitoni portabilitetin e të dhënave (të merrni një kopje të të dhënave në format
                të lexueshëm nga kompjuteri).
              </li>
            </ul>
            <p>
              Për të ushtruar cilëndo nga këto të drejta, ju lutemi na kontaktoni në{" "}
              <a href="mailto:privacy@forgeks.com">privacy@forgeks.com</a>.
            </p>
          </>
        ),
      },
      {
        title: "6. Shërbimet palë të treta",
        body: (
          <>
            <p>Ne integrohemi me shërbimet e mëposhtme palë të treta:</p>
            <ul>
              <li>
                <strong>Supabase</strong> — bazë të dhënash dhe autentikim (
                <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
                ).
              </li>
              <li>
                <strong>PayPal</strong> — përpunim pagesash (
                <a
                  href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
                ).
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "7. Ndryshimet në këtë politikë",
        body: (
          <p>
            Mund ta përditësojmë këtë Politikë të Privatësisë herë pas here. Do t'ju njoftojmë për ndryshime
            të rëndësishme me email ose përmes një njoftimi të dukshëm në faqen tonë.
          </p>
        ),
      },
    ],
    cta: (
      <p>
        Keni pyetje rreth privatësisë? <Link to="/contact">Na kontaktoni</Link> — do të jemi të lumtur t'ju
        ndihmojmë.
      </p>
    ),
  },
  de: {
    sections: [
      {
        title: "1. Welche Daten wir erheben",
        body: (
          <>
            <p>
              Wenn Sie ein Konto erstellen oder einen Einkauf bei ForgeKs tätigen, erfassen wir folgende
              personenbezogene Daten:
            </p>
            <ul>
              <li>
                <strong>Kontodaten:</strong> E-Mail-Adresse, Anzeigename und Passwort (sicher gespeichert über
                Supabase Auth).
              </li>
              <li>
                <strong>Transaktionsdaten:</strong> Kaufhistorie, gelieferte Spielschlüssel und Art der
                Zahlungsmethode (wir speichern keine vollständigen Kartendaten – Zahlungen werden von PayPal
                oder Ihrer gewählten Krypto-Wallet verarbeitet).
              </li>
              <li>
                <strong>Nutzungsdaten:</strong> Besuchte Seiten, Suchanfragen sowie Geräte-/Browser-Infos, die
                anonym zur Verbesserung unseres Dienstes erfasst werden.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "2. Wie wir Ihre Daten verwenden",
        body: (
          <>
            <ul>
              <li>
                Zur Verarbeitung und Erfüllung Ihrer Bestellungen und zur Lieferung von Spielschlüsseln.
              </li>
              <li>Zum Versenden von Bestellbestätigungen und wichtigen Kontobenachrichtigungen.</li>
              <li>Zur Personalisierung Ihrer Erfahrung (z. B. Wunschliste, Bestellverlauf).</li>
              <li>Zur Erkennung und Verhinderung von Betrug oder Missbrauch.</li>
              <li>Zur Einhaltung gesetzlicher Verpflichtungen.</li>
            </ul>
            <p>
              Wir <strong>verkaufen</strong> Ihre personenbezogenen Daten <strong>nicht</strong> an Dritte.
            </p>
          </>
        ),
      },
      {
        title: "3. Datenspeicherung und Sicherheit",
        body: (
          <p>
            Ihre Daten werden auf der Infrastruktur von Supabase gespeichert, die branchenübliche
            Verschlüsselung im Ruhezustand und bei der Übertragung (TLS 1.2+) einsetzt. Der Zugriff ist nur
            befugtem Personal gestattet.
          </p>
        ),
      },
      {
        title: "4. Cookies",
        body: (
          <p>
            Wir verwenden nur unbedingt erforderliche Cookies für Authentifizierung und Sitzungsverwaltung.
            Wir verwenden keine Tracking- oder Werbe-Cookies. Sie können Cookies in den
            Browser-Einstellungen deaktivieren, dies kann jedoch die Funktionalität der Website beeinträchtigen.
          </p>
        ),
      },
      {
        title: "5. Ihre Rechte",
        body: (
          <>
            <p>Je nach Rechtsraum haben Sie möglicherweise das Recht:</p>
            <ul>
              <li>Auskunft über die personenbezogenen Daten zu erhalten, die wir über Sie speichern.</li>
              <li>Die Berichtigung oder Löschung Ihrer Daten zu verlangen.</li>
              <li>Der Verarbeitung bestimmter Daten zu widersprechen oder sie einzuschränken.</li>
              <li>
                Datenübertragbarkeit zu verlangen (eine Kopie Ihrer Daten in einem maschinenlesbaren Format).
              </li>
            </ul>
            <p>
              Zur Ausübung dieser Rechte kontaktieren Sie uns bitte unter{" "}
              <a href="mailto:privacy@forgeks.com">privacy@forgeks.com</a>.
            </p>
          </>
        ),
      },
      {
        title: "6. Dienste Dritter",
        body: (
          <>
            <p>Wir integrieren die folgenden Dienste Dritter:</p>
            <ul>
              <li>
                <strong>Supabase</strong> – Datenbank und Authentifizierung (
                <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
                ).
              </li>
              <li>
                <strong>PayPal</strong> – Zahlungsabwicklung (
                <a
                  href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
                ).
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "7. Änderungen dieser Richtlinie",
        body: (
          <p>
            Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Über wesentliche Änderungen
            informieren wir Sie per E-Mail oder durch einen gut sichtbaren Hinweis auf unserer Website.
          </p>
        ),
      },
    ],
    cta: (
      <p>
        Fragen zu Ihrem Datenschutz? <Link to="/contact">Kontaktieren Sie uns</Link> – wir helfen gerne weiter.
      </p>
    ),
  },
};

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const langCode = i18n.language?.split("-")[0] || "en";
  const lang = langCode === "sq" || langCode === "de" ? langCode : "en";
  const { sections, cta } = privacyCopy[lang];

  return (
    <div className="legal-page">
      <div className="legal-header">
        <Shield size={36} className="legal-icon" />
        <h1>{t("privacyPolicyTitle")}</h1>
        <p className="legal-updated">{t("lastUpdated")} March 2, 2026</p>
      </div>

      <div className="legal-content">
        {sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            {s.body}
          </section>
        ))}

        <div className="legal-contact-cta">{cta}</div>
      </div>
    </div>
  );
}
