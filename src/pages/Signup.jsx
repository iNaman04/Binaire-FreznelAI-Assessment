import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    signup(form.email, form.password)
      .then(function () { navigate("/models"); })
      .catch(function (err) { setError(err.message.replace("Firebase: ", "")); });
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="brand">BIN<span>AIRE</span></div>
        <div className="auth-copy">
          <p className="eyebrow">CREATE ACCOUNT</p>
          <h1>Build your model shortlist.</h1>
          <p>Your account is handled entirely through Firebase Authentication.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></label>
          <label>Password<input type="password" required minLength="6" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></label>
          <label>Confirm password<input type="password" required minLength="6" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} /></label>
          {error && <div className="error">{error}</div>}
          <button className="primary" type="submit">Create account</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
      <div className="auth-visual signup-visual">
        <div className="code-card"><span>MODEL</span><b>DISCOVERY</b><small>FAST · LOCAL · SEARCHABLE</small></div>
      </div>
    </div>
  );
}