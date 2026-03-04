import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const termsCopy = {
  en: {
    sections: [
      {
        title: "1. Acceptance of Terms",
        body: (
          <p>
            By creating an account or purchasing from ForgeKs, you agree to these Terms of Service and our{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>. If you do not agree, please do not use our
            services.
          </p>
        ),
      },
      {
        title: "2. Digital Products",
        body: (
          <p>
            ForgeKs sells digital game keys and gift cards for personal, non-commercial use only. All
            products are delivered electronically. Keys may not be resold, transferred, or distributed
            without our prior written consent.
          </p>
        ),
      },
      {
        title: "3. Account Responsibility",
        body: (
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activity under your account. Notify us immediately at{" "}
            <a href="mailto:support@forgeks.com">support@forgeks.com</a> if you suspect unauthorised access.
          </p>
        ),
      },
      {
        title: "4. Prohibited Conduct",
        body: (
          <>
            <p>You agree not to:</p>
            <ul>
              <li>Attempt to resell or redistribute purchased game keys.</li>
              <li>Use automated tools to scrape, harvest, or bulk-purchase products.</li>
              <li>
                Engage in fraudulent chargebacks or payment disputes without first contacting our support.
              </li>
              <li>Circumvent any security or access controls on the platform.</li>
            </ul>
            <p>Violations may result in account suspension and legal action.</p>
          </>
        ),
      },
      {
        title: "5. Refunds",
        body: (
          <p>
            Please see our <Link to="/refund-policy">Refund Policy</Link> for full details on eligibility
            and the refund process.
          </p>
        ),
      },
      {
        title: "6. Disclaimer of Warranties",
        body: (
          <p>
            ForgeKs provides the platform &quot;as is&quot; without warranties of any kind. We do not
            guarantee uninterrupted availability and are not liable for any indirect, incidental, or
            consequential damages arising from the use of our service.
          </p>
        ),
      },
      {
        title: "7. Changes to Terms",
        body: (
          <p>
            We reserve the right to update these Terms at any time. Continued use of the service after
            changes constitutes acceptance of the revised Terms.
          </p>
        ),
      },
      {
        title: "8. Contact",
        body: (
          <p>
            Questions about these Terms? <Link to="/contact">Contact us</Link> or email{" "}
            <a href="mailto:legal@forgeks.com">legal@forgeks.com</a>.
          </p>
        ),
      },
    ],
  },
  sq: {
    sections: [
      {
        title: "1. Pranimi i kushteve",
        body: (
          <p>
            Duke krijuar një llogari ose duke blerë nga ForgeKs, ju pranoni këto Kushte të Shërbimit dhe{" "}
            <Link to="/privacy-policy">Politikën tonë të Privatësisë</Link>. Nëse nuk pajtoheni, ju lutemi
            mos përdorni shërbimet tona.
          </p>
        ),
      },
      {
        title: "2. Produkte dixhitale",
        body: (
          <p>
            ForgeKs shet çelësa dixhitalë lojërash dhe karta dhuratë vetëm për përdorim personal, jo
            komercial. Të gjitha produktet dorëzohen në mënyrë elektronike. Çelësat nuk mund të rishiten,
            transferohen ose shpërndahen pa miratimin tonë me shkrim.
          </p>
        ),
      },
      {
        title: "3. Përgjegjësia për llogarinë",
        body: (
          <p>
            Ju jeni përgjegjës për ruajtjen e fshehtësisë së kredencialeve të llogarisë dhe për çdo aktivitet
            që kryhet përmes saj. Na njoftoni menjëherë në{" "}
            <a href="mailto:support@forgeks.com">support@forgeks.com</a> nëse dyshoni për hyrje të
            paautorizuar.
          </p>
        ),
      },
      {
        title: "4. Sjellje e ndaluar",
        body: (
          <>
            <p>Ju pranoni të mos:</p>
            <ul>
              <li>Tentoni të rishisni ose rishpërndani çelësat e blerë të lojërave.</li>
              <li>Përdorni mjete automatike për të skanuar, mbledhur ose blerë produkte në masë.</li>
              <li>
                Angazhoheni në chargeback-e mashtruese ose mosmarrëveshje pagese pa kontaktuar më parë
                mbështetjen tonë.
              </li>
              <li>Anashkaloni çdo masë sigurie ose kontroll aksesimi në platformë.</li>
            </ul>
            <p>Shkeljet mund të çojnë në pezullim të llogarisë dhe veprime ligjore.</p>
          </>
        ),
      },
      {
        title: "5. Rimbursimet",
        body: (
          <p>
            Ju lutemi shikoni <Link to="/refund-policy">Politikën tonë të Rimbursimit</Link> për detaje të
            plota mbi kriteret dhe procesin e rimbursimit.
          </p>
        ),
      },
      {
        title: "6. Mohimi i garancive",
        body: (
          <p>
            ForgeKs ofron platformën &quot;siç është&quot; pa asnjë lloj garancie. Ne nuk garantojmë
            funksionim të pandërprerë dhe nuk mbajmë përgjegjësi për dëme indirekte, rastësore ose pasuese
            që dalin nga përdorimi i shërbimit tonë.
          </p>
        ),
      },
      {
        title: "7. Ndryshimet në kushte",
        body: (
          <p>
            Ne rezervojmë të drejtën të përditësojmë këto Kushte në çdo kohë. Përdorimi i vazhdueshëm i
            shërbimit pas ndryshimeve nënkupton pranimin e Kushteve të përditësuara.
          </p>
        ),
      },
      {
        title: "8. Kontakti",
        body: (
          <p>
            Keni pyetje rreth këtyre Kushteve? <Link to="/contact">Na kontaktoni</Link> ose dërgoni email në{" "}
            <a href="mailto:legal@forgeks.com">legal@forgeks.com</a>.
          </p>
        ),
      },
    ],
  },
  de: {
    sections: [
      {
        title: "1. Akzeptanz der Bedingungen",
        body: (
          <p>
            Durch das Erstellen eines Kontos oder einen Kauf bei ForgeKs erklären Sie sich mit diesen
            Nutzungsbedingungen und unserer{" "}
            <Link to="/privacy-policy">Datenschutzrichtlinie</Link> einverstanden. Wenn Sie nicht
            einverstanden sind, nutzen Sie unsere Dienste bitte nicht.
          </p>
        ),
      },
      {
        title: "2. Digitale Produkte",
        body: (
          <p>
            ForgeKs verkauft digitale Spielschlüssel und Geschenkkarten ausschließlich für den persönlichen,
            nicht-kommerziellen Gebrauch. Alle Produkte werden elektronisch geliefert. Schlüssel dürfen nicht
            ohne unsere vorherige schriftliche Zustimmung weiterverkauft, übertragen oder verteilt werden.
          </p>
        ),
      },
      {
        title: "3. Verantwortung für das Konto",
        body: (
          <p>
            Sie sind dafür verantwortlich, die Vertraulichkeit Ihrer Zugangsdaten zu wahren und für alle
            Aktivitäten, die unter Ihrem Konto stattfinden. Bitte informieren Sie uns umgehend unter{" "}
            <a href="mailto:support@forgeks.com">support@forgeks.com</a>, wenn Sie einen unbefugten Zugriff
            vermuten.
          </p>
        ),
      },
      {
        title: "4. Verbotenes Verhalten",
        body: (
          <>
            <p>Sie verpflichten sich, nicht:</p>
            <ul>
              <li>Gekaufte Spielschlüssel weiterzuverkaufen oder zu verteilen.</li>
              <li>Automatisierte Tools zum Scrapen, Sammeln oder Massenkauf von Produkten zu verwenden.</li>
              <li>
                Betrügerische Rückbuchungen oder Zahlungsstreitigkeiten einzuleiten, ohne zuvor unseren Support
                zu kontaktieren.
              </li>
              <li>Sicherheits- oder Zugriffskontrollen der Plattform zu umgehen.</li>
            </ul>
            <p>Verstöße können zur Sperrung des Kontos und zu rechtlichen Schritten führen.</p>
          </>
        ),
      },
      {
        title: "5. Rückerstattungen",
        body: (
          <p>
            Details zu Anspruch und Ablauf finden Sie in unserer{" "}
            <Link to="/refund-policy">Rückerstattungsrichtlinie</Link>.
          </p>
        ),
      },
      {
        title: "6. Haftungsausschluss",
        body: (
          <p>
            ForgeKs stellt die Plattform &quot;wie besehen&quot; ohne jegliche Garantien zur Verfügung. Wir
            garantieren keine ununterbrochene Verfügbarkeit und haften nicht für indirekte, zufällige oder
            Folgeschäden, die aus der Nutzung unseres Dienstes entstehen.
          </p>
        ),
      },
      {
        title: "7. Änderungen der Bedingungen",
        body: (
          <p>
            Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu aktualisieren. Die weitere Nutzung
            des Dienstes nach Änderungen gilt als Zustimmung zu den überarbeiteten Bedingungen.
          </p>
        ),
      },
      {
        title: "8. Kontakt",
        body: (
          <p>
            Fragen zu diesen Bedingungen? <Link to="/contact">Kontaktieren Sie uns</Link> oder schreiben Sie
            an{" "}
            <a href="mailto:legal@forgeks.com">legal@forgeks.com</a>.
          </p>
        ),
      },
    ],
  },
};

export default function TermsOfService() {
  const { t, i18n } = useTranslation();
  const langCode = i18n.language?.split("-")[0] || "en";
  const lang = langCode === "sq" || langCode === "de" ? langCode : "en";
  const sections = termsCopy[lang].sections;

  return (
    <div className="legal-page">
      <div className="legal-header">
        <FileText size={36} className="legal-icon" />
        <h1>{t("termsOfServiceTitle")}</h1>
        <p className="legal-updated">{t("lastUpdated")} March 2, 2026</p>
      </div>

      <div className="legal-content">
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.body}
          </section>
        ))}
      </div>
    </div>
  );
}
