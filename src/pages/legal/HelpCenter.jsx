import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const faqCopy = {
  en: [
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
  ],
  sq: [
    {
      category: "Porositë & Dorëzimi",
      items: [
        {
          q: "Sa shpejt e marr çelësin e lojës?",
          a: "Çelësat e lojërave dorëzohen menjëherë në llogarinë tuaj pas një pagese të suksesshme. Shkoni te Porositë e mia për ta parë dhe kopjuar çelësin. Do të merrni edhe një njoftim brenda faqes.",
        },
        {
          q: "Ku e gjej çelësin tim të lojës?",
          a: "Hapni Porositë e mia (menuja sipër djathtas → Porositë) dhe klikoni mbi porosinë tuaj. Çelësi/çelësat e lojës do të shfaqen aty.",
        },
        {
          q: "Çelësi im nuk funksionon. Çfarë duhet të bëj?",
          a: "Së pari, sigurohuni që po e shlyeni çelësin në platformën e duhur. Nëse çelësi është vërtet i pavlefshëm, ju lutemi kontaktoni ekipin tonë të mbështetjes – ne do ta verifikojmë dhe do ta zëvendësojmë ose do të ofrojmë rimbursim.",
        },
        {
          q: "A mund ta anuloj porosinë time?",
          a: "Porositë mund të anulohen përpara se çelësi i lojës të shfaqet. Pasi çelësi të shfaqet në porosinë tuaj, ai nuk mund të anulohet. Ju lutemi rishikoni blerjen me kujdes përpara përfundimit të pagesës.",
        },
      ],
    },
    {
      category: "Pagesat",
      items: [
        {
          q: "Çfarë mënyrash pagese pranoni?",
          a: "Ne pranojmë PayPal dhe disa kriptomonedha të përzgjedhura. Në të ardhmen mund të shtohen edhe metoda të tjera pagese.",
        },
        {
          q: "A janë të sigurta të dhënat e mia të pagesës?",
          a: "Po. Ne nuk ruajmë të dhënat tuaja të kartës ose detaje të plota pagese. Të gjitha pagesat përpunohen përmes infrastrukturës së sigurt të PayPal ose direkt në blockchain për kripto.",
        },
        {
          q: "Më është marrë pagesa por nuk mora çelës. Çfarë duhet të bëj?",
          a: "Së pari kontrolloni faqen Porositë e mia – çelësi mund të jetë shfaqur tashmë aty. Nëse jo, na kontaktoni me ID-në e transaksionit dhe ne do ta zgjidhim brenda 24 orëve.",
        },
      ],
    },
    {
      category: "Llogaria",
      items: [
        {
          q: "Si të krijoj një llogari?",
          a: "Klikoni butonin Hyr në shiritin e sipërm të navigimit, pastaj zgjidhni Krijo llogari. Mund të regjistroheni me adresën tuaj të emailit.",
        },
        {
          q: "Kam harruar fjalëkalimin. Si ta rivendos?",
          a: "Klikoni Hyr, pastaj 'Keni harruar fjalëkalimin?' dhe vendosni adresën e emailit. Së shpejti do të merrni një lidhje për rivendosjen e fjalëkalimit.",
        },
        {
          q: "Si t’i përditësoj të dhënat e profilit?",
          a: "Shkoni te faqja e Profilit tuaj (menuja e përdoruesit sipër djathtas → Profili) për të përditësuar emrin e shfaqur dhe cilësime të tjera të llogarisë.",
        },
      ],
    },
    {
      category: "Lojërat & Platformat",
      items: [
        {
          q: "A janë të gjitha lojërat pa kufizime rajonale?",
          a: "Shumica e çelësave të lojërave janë globalë/multi-rajonalë. Kur një çelës ka bllokim rajonal, kjo tregohet qartë në faqen e produktit. Gjithmonë kontrolloni përpara se të blini.",
        },
        {
          q: "Si ta shlyej një çelës Steam?",
          a: "Hapni klientin Steam, klikoni te Games në menunë kryesore, pastaj Activate a Product on Steam. Vendosni çelësin dhe ndiqni udhëzimet në ekran.",
        },
        {
          q: "Si ta shlyej një çelës PlayStation?",
          a: "Në PS5 ose PS4 tuaj, hapni PlayStation Store, lëvizni poshtë te Redeem Codes, vendosni kodin dhe konfirmoni.",
        },
      ],
    },
  ],
  de: [
    {
      category: "Bestellungen & Lieferung",
      items: [
        {
          q: "Wie schnell erhalte ich meinen Spielschlüssel?",
          a: "Spielschlüssel werden unmittelbar nach erfolgreicher Zahlung in Ihr Konto geliefert. Gehen Sie zu Meine Bestellungen, um den Schlüssel anzusehen und zu kopieren. Sie erhalten außerdem eine Benachrichtigung in der App.",
        },
        {
          q: "Wo finde ich meinen Spielschlüssel?",
          a: "Öffnen Sie Meine Bestellungen (Menü oben rechts → Meine Bestellungen) und klicken Sie auf Ihre Bestellung. Ihre Spielschlüssel werden dort angezeigt.",
        },
        {
          q: "Mein Spielschlüssel funktioniert nicht. Was soll ich tun?",
          a: "Stellen Sie zuerst sicher, dass Sie den Schlüssel auf der richtigen Plattform einlösen. Wenn der Schlüssel tatsächlich ungültig ist, kontaktieren Sie bitte unser Support-Team – wir prüfen den Fall und ersetzen den Schlüssel oder erstatten den Betrag.",
        },
        {
          q: "Kann ich meine Bestellung stornieren?",
          a: "Bestellungen können storniert werden, solange der Spielschlüssel noch nicht angezeigt wurde. Sobald der Schlüssel in Ihrer Bestellung sichtbar ist, kann sie nicht mehr storniert werden. Bitte prüfen Sie Ihren Einkauf sorgfältig vor dem Bezahlen.",
        },
      ],
    },
    {
      category: "Zahlungen",
      items: [
        {
          q: "Welche Zahlungsmethoden akzeptieren Sie?",
          a: "Wir akzeptieren PayPal und ausgewählte Kryptowährungen. In Zukunft können weitere Zahlungsmethoden hinzukommen.",
        },
        {
          q: "Sind meine Zahlungsdaten sicher?",
          a: "Ja. Wir speichern Ihre Karten- oder Zahlungsdaten nicht. Alle Zahlungen werden über die sichere Infrastruktur von PayPal oder direkt on-chain für Krypto abgewickelt.",
        },
        {
          q: "Ich wurde belastet, habe aber keinen Schlüssel erhalten. Was nun?",
          a: "Prüfen Sie zunächst Ihre Seite Meine Bestellungen – der Schlüssel könnte bereits dort sein. Wenn nicht, kontaktieren Sie uns mit Ihrer Transaktions-ID und wir kümmern uns innerhalb von 24 Stunden darum.",
        },
      ],
    },
    {
      category: "Konto",
      items: [
        {
          q: "Wie erstelle ich ein Konto?",
          a: "Klicken Sie auf den Anmelden-Button in der oberen Navigationsleiste und wählen Sie anschließend Konto erstellen. Sie können sich mit Ihrer E-Mail-Adresse registrieren.",
        },
        {
          q: "Ich habe mein Passwort vergessen. Wie setze ich es zurück?",
          a: "Klicken Sie auf Anmelden und dann auf „Passwort vergessen?“ und geben Sie Ihre E-Mail-Adresse ein. Sie erhalten in Kürze einen Link zum Zurücksetzen des Passworts.",
        },
        {
          q: "Wie aktualisiere ich meine Profildaten?",
          a: "Gehen Sie zu Ihrer Profilseite (Benutzermenü oben rechts → Profil), um Ihren Anzeigenamen und andere Kontoeinstellungen zu aktualisieren.",
        },
      ],
    },
    {
      category: "Spiele & Plattformen",
      items: [
        {
          q: "Sind alle Spiele regionsfrei?",
          a: "Die meisten Spielschlüssel sind global bzw. multi-regional. Wenn ein Schlüssel regionsbeschränkt ist, wird dies deutlich auf der Produktseite angegeben. Prüfen Sie dies bitte vor dem Kauf.",
        },
        {
          q: "Wie löse ich einen Steam-Schlüssel ein?",
          a: "Öffnen Sie den Steam-Client, klicken Sie in der Menüleiste auf Spiele und dann auf Ein Produkt bei Steam aktivieren. Geben Sie Ihren Schlüssel ein und folgen Sie den Anweisungen.",
        },
        {
          q: "Wie löse ich einen PlayStation-Schlüssel ein?",
          a: "Navigieren Sie auf Ihrer PS5 oder PS4 zum PlayStation Store, scrollen Sie zu Codes einlösen, geben Sie Ihren Code ein und bestätigen Sie.",
        },
      ],
    },
  ],
};

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
  const { t, i18n } = useTranslation();
  const langCode = i18n.language?.split("-")[0] || "en";
  const lang = langCode === "sq" || langCode === "de" ? langCode : "en";
  const faqs = faqCopy[lang];

  return (
    <div className="legal-page help-center-page">
      <div className="legal-header">
        <HelpCircle size={36} className="legal-icon" />
        <h1>{t("helpCenterTitle")}</h1>
        <p>
          {lang === "en" &&
            "Find answers to the most common questions below."}
          {lang === "sq" &&
            "Gjeni më poshtë përgjigje për pyetjet më të shpeshta."}
          {lang === "de" &&
            "Hier finden Sie Antworten auf die häufigsten Fragen."}
        </p>
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
