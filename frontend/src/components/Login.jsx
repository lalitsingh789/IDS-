import { useState, useEffect } from "react";
import "../styles/Login.css";

export default function Login({
  onLogin,
  onSwitchToRegister,
  onSwitchToAdmin
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [particles, setParticles] = useState([]);
  const [scanLine, setScanLine] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const pts = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    setParticles(pts);

    const scanId = setInterval(() => {
      setScanLine((p) => (p >= 100 ? 0 : p + 0.4));
    }, 20);

    const glitchId = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4000);

    return () => {
      clearInterval(scanId);
      clearInterval(glitchId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onLogin(data.user, data.token);
      } else {
        setError(data.message || "ACCESS DENIED — Invalid credentials");
      }
    } catch {
      setError("SERVER CONNECTION FAILED");
    }

    setLoading(false);
  };

  return (
    <div className="root">
      <div className="gridBg" />

      <div
        className="scanLine"
        style={{
          top: `${scanLine}%`,
        }}
      />

      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "#00e0c8",
            opacity: p.opacity,
            pointerEvents: "none",
          }}
        />
      ))}

      <div className="statusBar">
        <span className="statusDot" />
        <span className="statusText">
          SENTINEL NETWORK · SECURE CHANNEL ACTIVE
        </span>
        <span
          className="statusText"
          style={{ marginLeft: "auto" }}
        >
          USER ACCESS
        </span>
      </div>

      <div className="card">
        <div className="iconWrap">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path
              d="M26 4L6 12v14c0 12 8.4 23.2 20 26 11.6-2.8 20-14 20-26V12L26 4z"
              fill="rgba(0,224,200,0.08)"
              stroke="#00e0c8"
              strokeWidth="1.5"
            />
            <circle
              cx="26"
              cy="24"
              r="8"
              stroke="#00e0c8"
              strokeWidth="1.5"
            />
            <circle cx="26" cy="24" r="3" fill="#00e0c8" />
          </svg>
          <div className="iconPing" />
        </div>

        <div className={`title ${glitch ? "titleGlitch" : ""}`}>
          IDS SENTINEL
        </div>

        <div className="subtitle">
          USER LOGIN PORTAL
        </div>

        <div className="divider" />

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className="fieldGroup">
            <label className="label">EMAIL ADDRESS</label>
            <div className="inputWrap">
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div className="fieldGroup">
            <label className="label">PASSWORD</label>
            <div className="inputWrap">
              <input
                className="input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />

              <button
                type="button"
                className="eyeBtn"
                onClick={() => setShowPass(!showPass)}
              >
                👁
              </button>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="submitBtn"
          >
            {loading ? "AUTHENTICATING..." : "USER LOGIN"}
          </button>
        </form>

        <div className="loginLink">
          New user?{" "}
          <span onClick={onSwitchToRegister}>
            REGISTER HERE
          </span>
        </div>

        <div className="loginLink">
          Admin access?{" "}
          <span onClick={onSwitchToAdmin}>
            ADMIN LOGIN
          </span>
        </div>
      </div>

      <div className="bottomBar">
        <span className="statusText">
          © 2025 IDS SENTINEL · ALL CONNECTIONS ENCRYPTED
        </span>
      </div>
    </div>
  );
}