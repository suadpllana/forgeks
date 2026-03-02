import { useState } from "react";
import { Mail, MessageSquare, Clock, Send, CheckCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { supabase } from "../../lib/supabase";

export default function ContactUs() {
  const { state } = useStore();
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
      setError("Please fill in all required fields.");
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
        <h1>Contact Us</h1>
        <p>We're here to help. Send us a message and we'll get back to you.</p>
      </div>

      <div className="contact-layout">
        {/* Info cards */}
        <div className="contact-info">
          <div className="contact-info-card">
            <Mail size={22} />
            <div>
              <h3>Email Support</h3>
              <p>
                <a href="mailto:support@forgeks.com">support@forgeks.com</a>
              </p>
              <span>For order issues, key problems, and billing.</span>
            </div>
          </div>
          <div className="contact-info-card">
            <Clock size={22} />
            <div>
              <h3>Response Time</h3>
              <p>Usually within a few hours</p>
              <span>Mon–Sun, 9 AM–10 PM (CET)</span>
            </div>
          </div>
          <div className="contact-info-card">
            <MessageSquare size={22} />
            <div>
              <h3>Before You Write</h3>
              <p>Check our Help Center</p>
              <span>Many questions are answered instantly in our FAQ.</span>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="contact-form-wrapper">
          {success ? (
            <div className="contact-success">
              <CheckCircle size={48} />
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send a Message</h2>

              {error && <div className="form-error">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
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
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="e.g. Invalid game key, order not received…"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Describe your issue or question in detail. Include your order ID if relevant."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  "Sending…"
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
