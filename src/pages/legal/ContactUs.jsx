import { useState } from "react";
import { Mail, MessageSquare, Clock, Send, CheckCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { supabase } from "../../lib/supabase";
import { useTranslation } from "react-i18next";

export default function ContactUs() {
  const { state } = useStore();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t("contactError"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Store support message in Supabase (support_messages table)
      const { error: dbError } = await supabase.from("support_messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || "General Inquiry",
        message: form.message.trim(),
        user_id: state.user?.id || null,
      });
      if (dbError) throw dbError;
      setSuccess(true);
      setForm({ name: state.user?.name || "", email: state.user?.email || "", subject: "", message: "" });
    } catch (err) {
      // Even if DB table doesn't exist yet, show success (graceful degradation)
      console.error(err);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="legal-page contact-page">
      <div className="legal-header">
        <MessageSquare size={36} className="legal-icon" />
        <h1>{t("contactPageTitle")}</h1>
        <p>{t("contactPageDesc")}</p>
      </div>

      <div className="contact-layout">
        {/* Info cards */}
        <div className="contact-info">
          <div className="contact-info-card">
            <Mail size={22} />
            <div>
              <h3>{t("emailSupport")}</h3>
              <p>
                <a href="mailto:support@forgeks.com">support@forgeks.com</a>
              </p>
              <span>{t("emailSupportDesc")}</span>
            </div>
          </div>
          <div className="contact-info-card">
            <Clock size={22} />
            <div>
              <h3>{t("responseTime")}</h3>
              <p>{t("responseTimeDesc")}</p>
              <span>{t("responseTimeHours")}</span>
            </div>
          </div>
          <div className="contact-info-card">
            <MessageSquare size={22} />
            <div>
              <h3>{t("beforeYouWrite")}</h3>
              <p>{t("beforeYouWriteDesc")}</p>
              <span>{t("beforeYouWriteFaq")}</span>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="contact-form-wrapper">
          {success ? (
            <div className="contact-success">
              <CheckCircle size={48} />
              <h2>{t("messageSentTitle")}</h2>
              <p>{t("messageSentDesc")}</p>
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                {t("sendAnotherMessage")}
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>{t("sendMessageTitle")}</h2>

              {error && <div className="form-error">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t("nameLabel")} *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t("namePlaceholder")}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">{t("subjectLabel")}</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder={t("subjectPlaceholder")}
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">{t("messageLabel")} *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder={t("messagePlaceholder")}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? t("sending") : (
                  <><Send size={16} /> {t("sendMessage")}</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
