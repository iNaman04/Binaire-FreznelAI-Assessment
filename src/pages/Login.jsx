import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    setError("");
    login(form.email, form.password)
      .then(function () { navigate("/models"); })
      .catch(function (err) { setError(err.message.replace("Firebase: ", "")); });
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="brand">BIN<span>AIRE</span></div>
        <div className="auth-copy">
          <p className="eyebrow">MODEL EXPLORER</p>
          <h1>Find the right model.</h1>
          <p>Search, filter and compare API models from one focused workspace.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></label>
          <label>Password<input type="password" required minLength="6" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></label>
          {error && <div className="error">{error}</div>}
          <button className="primary" type="submit">Sign in</button>
        </form>
        <p className="auth-switch">No account? <Link to="/signup">Create one</Link></p>
      </div>
      <div className="auth-visual">
        <div className="orb orb-one" /><div className="orb orb-two" />
        <div className="visual-grid" />
        <div className="visual-label">API → FILTER → SELECT</div>
      </div>
    </div>
  );
}