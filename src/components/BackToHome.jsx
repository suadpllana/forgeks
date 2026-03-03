import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BackToHome() {
  const { t } = useTranslation();
  return (
    <Link to="/games" className="mobile-back-home">
      <ArrowLeft size={18} />
      <span>{t("allGames")}</span>
    </Link>
  );
}
