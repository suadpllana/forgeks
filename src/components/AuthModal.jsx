import { useState } from "react";
import { X, Mail, Lock, UserIcon, Github, Chrome, CheckCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { supabase } from "../lib/supabase";

export default function AuthModal() {
  const { state, dispatch } = useStore();
  const [mode, setMode] = useState(state.authMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  if (!state.authModalOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
          },
        });
        if (signUpError) throw signUpError;
        setRegisteredEmail(form.email);
        setForm({ name: "", email: "", password: "" });
        setEmailSent(true);
        return;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) throw signInError;
      }
      dispatch({ type: "CLOSE_AUTH_MODAL" });
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: forgotEmail,
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;
      setMagicLinkSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSocial(provider) {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: provider.toLowerCase(),
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <div className="modal-overlay" onClick={() => dispatch({ type: "CLOSE_AUTH_MODAL" })}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={() => dispatch({ type: "CLOSE_AUTH_MODAL" })}
        >
          <X size={20} />
        </button>

        {emailSent ? (
          <div className="email-sent-screen">
            <CheckCircle size={56} className="email-sent-icon" />
            <h2>Check your email</h2>
            <p className="auth-subtitle">
              A confirmation link has been sent to<br />
              <strong>{registeredEmail}</strong>
            </p>
            <p className="email-sent-hint">Click the link in the email to verify your account, then sign in.</p>
            <button
              className="btn btn-primary full-width"
              onClick={() => { setEmailSent(false); setMode("signin"); setError(""); }}
            >
              Go to Sign In
            </button>
          </div>
        ) : magicLinkSent ? (
          <div className="email-sent-screen">
            <CheckCircle size={56} className="email-sent-icon" />
            <h2>Magic link sent!</h2>
            <p className="auth-subtitle">
              A sign-in link has been sent to<br />
              <strong>{forgotEmail}</strong>
            </p>
            <p className="email-sent-hint">Open the link in your email to sign in instantly — no password needed.</p>
            <button
              className="btn btn-primary full-width"
              onClick={() => { setMagicLinkSent(false); setForgotEmail(""); setMode("signin"); setError(""); }}
            >
              Back to Sign In
            </button>
          </div>
        ) : mode === "forgot" ? (
          <>
            <button
              className="back-btn"
              onClick={() => { setMode("signin"); setError(""); }}
            >
              ← Back
            </button>
            <h2>Forgot Password</h2>
            <p className="auth-subtitle">Enter your email and we'll send you a magic sign-in link.</p>
            {error && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", textAlign: "center", margin: "0.5rem 0" }}>{error}</p>}
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>
          </>
        ) : (
          <>
        <h2>{mode === "signin" ? "Welcome Back" : "Create Account"}</h2>
        <p className="auth-subtitle">
          {mode === "signin"
            ? "Sign in to access your games and orders"
            : "Join Forge Ks and start gaming today"}
        </p>

        {error && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", textAlign: "center", margin: "0.5rem 0" }}>{error}</p>}

        {/* Social login */}
        <div className="social-btns">
          <button className="social-btn google" onClick={() => handleSocial("Google")} disabled={loading}>
            <Chrome size={18} />
            Google
          </button>
          <button className="social-btn github" onClick={() => handleSocial("GitHub")} disabled={loading}>
            <Github size={18} />
            GitHub
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="form-group">
              <UserIcon size={16} />
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}
          <div className="form-group">
            <Mail size={16} />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <Lock size={16} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {mode === "signin" && (
          <p className="forgot-link">
            <button onClick={() => { setMode("forgot"); setError(""); }}>
              Forgot your password?
            </button>
          </p>
        )}

        <p className="auth-switch">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "signin" ? "register" : "signin"); setError(""); }}
          >
            {mode === "signin" ? "Register" : "Sign In"}
          </button>
        </p>
          </>
        )}
      </div>
    </div>
  );
}
