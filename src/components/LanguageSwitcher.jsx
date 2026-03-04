import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LANGS = [
  { code: "en", label: "english", flag: "🇬🇧", short: "EN" },
  { code: "sq", label: "albanian", flag: "🇦🇱", short: "SQ" },
  { code: "de", label: "german", flag: "🇩🇪", short: "DE" },
];

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function changeLang(code) {
    i18n.changeLanguage(code);
    localStorage.setItem("forgeks-lang", code);
    setOpen(false);
  }

  const current = LANGS.find((l) => l.code === i18n.language) || LANGS[0];

  return (
    <div className="lang-switcher" ref={ref}>
      <button className="lang-btn-current" onClick={() => setOpen((o) => !o)} title={t("language")}>
        <Globe size={15} />
        <span className="lang-btn-flag">{current.flag}</span>
        <span className="lang-btn-code">{current.short}</span>
      </button>
      {open && (
        <div className="lang-dropdown">
          <div className="lang-dropdown-header">{t("language")}</div>
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`lang-option ${i18n.language === l.code ? "active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => changeLang(l.code)}
            >
              <span className="lang-flag">{l.flag}</span>
              <span>{t(l.label)}</span>
              {i18n.language === l.code && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
