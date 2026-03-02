import { useState, useEffect } from "react";
import { X, Mail, Lock, UserIcon, Chrome, CheckCircle, Eye, EyeOff } from "lucide-react";
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
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Listen for PASSWORD_RECOVERY event and switch to reset mode
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("set-password");
        dispatch({ type: "OPEN_AUTH_MODAL", payload: "set-password" });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Sync mode when authMode changes externally
  useEffect(() => {
    setMode(state.authMode);
  }, [state.authMode]);

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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: window.location.href,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetNewPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      dispatch({ type: "CLOSE_AUTH_MODAL" });
      setNewPassword("");
      setConfirmPassword("");
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
        ) : resetSent ? (
          <div className="email-sent-screen">
            <CheckCircle size={56} className="email-sent-icon" />
            <h2>Password reset email sent!</h2>
            <p className="auth-subtitle">
              A reset link has been sent to<br />
              <strong>{forgotEmail}</strong>
            </p>
            <p className="email-sent-hint">Click the link in your email to set a new password.</p>
            <button
              className="btn btn-primary full-width"
              onClick={() => { setResetSent(false); setForgotEmail(""); setMode("signin"); setError(""); }}
            >
              Back to Sign In
            </button>
          </div>
        ) : mode === "set-password" ? (
          <>
            <h2>Set New Password</h2>
            <p className="auth-subtitle">Choose a strong password for your account.</p>
            {error && <p style={{ color: "#ff6b6b", fontSize: "0.85rem", textAlign: "center", margin: "0.5rem 0" }}>{error}</p>}
            <form onSubmit={handleSetNewPassword}>
              <div className="form-group">
                <Lock size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="form-group">
                <Lock size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        ) : mode === "forgot" ? (
          <>
            <button
              className="back-btn"
              onClick={() => { setMode("signin"); setError(""); }}
            >
              ← Back
            </button>
            <h2>Reset Password</h2>
            <p className="auth-subtitle">Enter your email and we'll send you a password reset link.</p>
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
                {loading ? "Sending..." : "Send Reset Link"}
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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
            <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
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
