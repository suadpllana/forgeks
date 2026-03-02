import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LANGS = [
  { code: "en", label: "english", flag: "🇬🇧" },
  { code: "sq", label: "albanian", flag: "🇦🇱" },
  { code: "de", label: "german", flag: "🇩🇪" },
];

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  function changeLang(code) {
    i18n.changeLanguage(code);
    localStorage.setItem("forgeks-lang", code);
    setOpen(false);
  }

  return (
    <div className="lang-switcher" onMouseLeave={() => setOpen(false)}>
      <button
        className="icon-btn lang-btn"
        onClick={() => setOpen((o) => !o)}
        title={t("language")}
      >
        <Globe size={20} />
      </button>
      {open && (
        <div className="lang-dropdown">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`lang-option ${i18n.language === l.code ? "active" : ""}`}
              onClick={() => changeLang(l.code)}
            >
              <span className="lang-flag">{l.flag}</span>
              <span>{t(l.label)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
