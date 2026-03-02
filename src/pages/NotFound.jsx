import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="not-found-page">
      <Ghost size={90} strokeWidth={1} className="not-found-icon" />
      <h1 className="not-found-code">404</h1>
      <h2>{t("pageNotFound")}</h2>
      <p>{t("pageNotFoundDesc")}</p>
      <Link to="/" className="btn btn-primary">
        {t("goHome")}
      </Link>
    </div>
  );
}
