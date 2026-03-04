import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

const refundCopy = {
  en: {
    overviewTitle: "Overview",
    overviewBody:
      "All purchases on ForgeKs are for digital game keys delivered instantly after payment. Due to the nature of digital goods, we have a strict but fair refund policy.",
    eligibleTitle: "Eligible Refunds",
    eligibleIntro: "You are eligible for a full refund if:",
    eligiblePoints: [
      "Your game key is invalid or already used at the time of delivery.",
      "The product you received is not the one you ordered.",
      "You have not yet revealed or copied the game key shown in your order details.",
      "You contact us within 14 days of purchase.",
    ],
    nonEligibleTitle: "Non-Eligible Refunds",
    nonEligibleIntro: "Refunds will not be granted if:",
    nonEligiblePoints: [
      "The game key has already been revealed, copied, or redeemed.",
      "You changed your mind after the key was delivered.",
      "The request is made more than 14 days after purchase.",
      "The issue is related to your device's compatibility or region lock — please check platform requirements before purchasing.",
    ],
    howTitle: "How to Request a Refund",
    howStep1: "Go to My Orders and locate the order in question.",
    howStep2Intro:
      "Contact us via our Contact page or email support@forgeks.com with:",
    howStep2Items: ["Your order ID", "The game title", "A description of the issue"],
    howStep3: "Our team will review your request within 1–2 business days.",
    methodTitle: "Refund Method",
    methodBody:
      "Approved refunds are issued to your original payment method (PayPal) within 3–5 business days, depending on your payment provider.",
    giftTitle: "Gift Cards",
    giftBody:
      "Gift card purchases are non-refundable once the code has been revealed or redeemed.",
    cta: "Need help with a refund?",
    ctaLink: "Contact our support team",
  },
  sq: {
    overviewTitle: "Përmbledhje",
    overviewBody:
      "Të gjitha blerjet në ForgeKs janë për çelësa dixhitalë lojërash që dorëzohen menjëherë pas pagesës. Për shkak të natyrës së produkteve dixhitale, ne kemi një politikë rimbursimi strikte por të drejtë.",
    eligibleTitle: "Rimbursimet e pranueshme",
    eligibleIntro: "Keni të drejtë për rimbursim të plotë nëse:",
    eligiblePoints: [
      "Çelësi juaj i lojës është i pavlefshëm ose i përdorur tashmë në momentin e dorëzimit.",
      "Produkti që keni marrë nuk është ai që keni porositur.",
      "Nuk e keni shfaqur ose kopjuar ende çelësin e lojës në detajet e porosisë.",
      "Na kontaktoni brenda 14 ditëve nga data e blerjes.",
    ],
    nonEligibleTitle: "Kur nuk jepet rimbursim",
    nonEligibleIntro: "Rimbursimet nuk do të ofrohen nëse:",
    nonEligiblePoints: [
      "Çelësi i lojës është shfaqur, kopjuar ose është shlyer tashmë.",
      "E keni ndryshuar mendjen pasi çelësi është dorëzuar.",
      "Kërkesa bëhet më shumë se 14 ditë pas blerjes.",
      "Problemi lidhet me pajtueshmërinë e pajisjes ose bllokimin rajonal — ju lutemi kontrolloni kërkesat e platformës para blerjes.",
    ],
    howTitle: "Si të kërkoni rimbursim",
    howStep1: "Shkoni te Porositë e mia dhe gjeni porosinë përkatëse.",
    howStep2Intro:
      "Na kontaktoni përmes faqes Kontakt ose me email në support@forgeks.com duke dërguar:",
    howStep2Items: ["ID-në e porosisë", "Titullin e lojës", "Përshkrimin e problemit"],
    howStep3: "Ekipi ynë do ta shqyrtojë kërkesën tuaj brenda 1–2 ditëve pune.",
    methodTitle: "Mënyra e rimbursimit",
    methodBody:
      "Rimbursimet e aprovuara dërgohen në të njëjtën mënyrë pagese (PayPal) brenda 3–5 ditëve pune, në varësi të ofruesit të pagesës.",
    giftTitle: "Kartat dhuratë",
    giftBody:
      "Blerjet e kartave dhuratë nuk janë të rimbursueshme pasi kodi të jetë shfaqur ose shlyer.",
    cta: "Keni nevojë për ndihmë me një rimbursim?",
    ctaLink: "Kontaktoni ekipin tonë të mbështetjes",
  },
  de: {
    overviewTitle: "Überblick",
    overviewBody:
      "Alle Käufe auf ForgeKs sind digitale Spielschlüssel, die sofort nach der Zahlung geliefert werden. Aufgrund der Natur digitaler Produkte haben wir eine strenge, aber faire Rückerstattungsrichtlinie.",
    eligibleTitle: "Rückerstattungen, die möglich sind",
    eligibleIntro: "Sie haben Anspruch auf eine vollständige Rückerstattung, wenn:",
    eligiblePoints: [
      "Ihr Spielschlüssel zum Zeitpunkt der Lieferung ungültig oder bereits verwendet ist.",
      "Das gelieferte Produkt nicht dem entspricht, was Sie bestellt haben.",
      "Sie den angezeigten Spielschlüssel in den Bestelldetails noch nicht angezeigt oder kopiert haben.",
      "Sie uns innerhalb von 14 Tagen nach dem Kauf kontaktieren.",
    ],
    nonEligibleTitle: "Wann keine Rückerstattung möglich ist",
    nonEligibleIntro: "Rückerstattungen werden nicht gewährt, wenn:",
    nonEligiblePoints: [
      "Der Spielschlüssel bereits angezeigt, kopiert oder eingelöst wurde.",
      "Sie Ihre Meinung geändert haben, nachdem der Schlüssel geliefert wurde.",
      "Die Anfrage mehr als 14 Tage nach dem Kauf gestellt wird.",
      "Das Problem mit der Kompatibilität Ihres Geräts oder einer Regionssperre zusammenhängt – bitte prüfen Sie die Plattformanforderungen vor dem Kauf.",
    ],
    howTitle: "So fordern Sie eine Rückerstattung an",
    howStep1: "Gehen Sie zu Meine Bestellungen und suchen Sie die betreffende Bestellung.",
    howStep2Intro:
      "Kontaktieren Sie uns über unsere Kontaktseite oder per E-Mail an support@forgeks.com mit:",
    howStep2Items: [
      "Ihrer Bestell-ID",
      "Dem Spieletitel",
      "Einer Beschreibung des Problems",
    ],
    howStep3:
      "Unser Team prüft Ihre Anfrage innerhalb von 1–2 Werktagen.",
    methodTitle: "Rückerstattungsmethode",
    methodBody:
      "Genehmigte Rückerstattungen werden innerhalb von 3–5 Werktagen auf Ihre ursprüngliche Zahlungsmethode (PayPal) zurückgebucht – abhängig von Ihrem Zahlungsanbieter.",
    giftTitle: "Geschenkkarten",
    giftBody:
      "Geschenkkartenkäufe sind nicht erstattungsfähig, sobald der Code angezeigt oder eingelöst wurde.",
    cta: "Brauchen Sie Hilfe bei einer Rückerstattung?",
    ctaLink: "Kontaktieren Sie unser Support-Team",
  },
};

export default function RefundPolicy() {
  const { t, i18n } = useTranslation();
  const langCode = i18n.language?.split("-")[0] || "en";
  const lang = langCode === "sq" || langCode === "de" ? langCode : "en";
  const c = refundCopy[lang];

  return (
    <div className="legal-page">
      <div className="legal-header">
        <RotateCcw size={36} className="legal-icon" />
        <h1>{t("refundPolicyTitle")}</h1>
        <p className="legal-updated">{t("lastUpdated")} March 2, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>{c.overviewTitle}</h2>
          <p>{c.overviewBody}</p>
        </section>

        <section>
          <h2>{c.eligibleTitle}</h2>
          <p>{c.eligibleIntro}</p>
          <ul>
            {c.eligiblePoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{c.nonEligibleTitle}</h2>
          <p>{c.nonEligibleIntro}</p>
          <ul>
            {c.nonEligiblePoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{c.howTitle}</h2>
          <ol>
            <li>
              {lang === "en" && (
                <>
                  Go to <Link to="/orders">My Orders</Link> and locate the order in question.
                </>
              )}
              {lang === "sq" && (
                <>
                  Shkoni te <Link to="/orders">Porositë e mia</Link> dhe gjeni porosinë përkatëse.
                </>
              )}
              {lang === "de" && (
                <>
                  Gehen Sie zu <Link to="/orders">Meine Bestellungen</Link> und suchen Sie die betreffende Bestellung.
                </>
              )}
            </li>
            <li>
              {lang === "en" && (
                <>
                  Contact us via our <Link to="/contact">Contact page</Link> or email{" "}
                  <a href="mailto:support@forgeks.com">support@forgeks.com</a> with:
                </>
              )}
              {lang === "sq" && (
                <>
                  Na kontaktoni përmes <Link to="/contact">faqes Kontakt</Link> ose me email{" "}
                  <a href="mailto:support@forgeks.com">support@forgeks.com</a> duke dërguar:
                </>
              )}
              {lang === "de" && (
                <>
                  Kontaktieren Sie uns über die <Link to="/contact">Kontaktseite</Link> oder per E-Mail an{" "}
                  <a href="mailto:support@forgeks.com">support@forgeks.com</a> mit:
                </>
              )}
              <ul>
                {c.howStep2Items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
            <li>{c.howStep3}</li>
          </ol>
        </section>

        <section>
          <h2>{c.methodTitle}</h2>
          <p>{c.methodBody}</p>
        </section>

        <section>
          <h2>{c.giftTitle}</h2>
          <p>{c.giftBody}</p>
        </section>

        <div className="legal-contact-cta">
          <p>
            {c.cta} <Link to="/contact">{c.ctaLink}</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
