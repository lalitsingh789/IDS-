import { useState, useEffect } from "react";
import "../styles/Register.css";

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organizationId: "",
    userType: "",
    researchArea: "",
    password: "",
    confirmPassword: "",
    role: "user",
    adminSecret: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("PASSWORDS DO NOT MATCH");
      return;
    }

    if (formData.role === "admin" && !formData.adminSecret) {
      setError("ADMIN SECRET KEY REQUIRED");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          organizationId: formData.organizationId,
          userType: formData.userType,
          researchArea: formData.researchArea,
          password: formData.password,
          role: formData.role,
          adminSecret: formData.adminSecret,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message || "REGISTRATION SUCCESSFUL");

        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch {
      setError("SERVER CONNECTION FAILED");
    }

    setLoading(false);
  };

  return (
    <div className="root">
      <div className="gridBg" />
      <div className="scanLine" style={{ top: `${scanLine}%` }} />

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
      </div>

      <div className="card">
        <div className={`title ${glitch ? "titleGlitch" : ""}`}>
          IDS SENTINEL
        </div>

        <div className="subtitle">
          REGISTRATION PORTAL
        </div>

        <div className="divider" />

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            className="input"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="organizationId"
            placeholder="Organization ID"
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="researchArea"
            placeholder="Area of Research"
            onChange={handleChange}
            required
          />

          <select
            className="input"
            name="userType"
            onChange={handleChange}
            required
          >
            <option value="">Select User Type</option>
            <option>Student</option>
            <option>Researcher</option>
            <option>Faculty</option>
          </select>

          <select
            className="input"
            name="role"
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {formData.role === "admin" && (
            <input
              className="input"
              name="adminSecret"
              placeholder="Create Admin Secret Key"
              onChange={handleChange}
              required
            />
          )}

          <div className="inputWrap">
            <input
              className="input"
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
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

          <div className="inputWrap">
            <input
              className="input"
              type={showConfirmPass ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="eyeBtn"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              👁
            </button>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button className="submitBtn" type="submit" disabled={loading}>
            {loading ? "REGISTERING..." : "REGISTER"}
          </button>
        </form>

        <div className="loginLink">
          Already have an account?{" "}
          <span onClick={onSwitchToLogin}>
            LOGIN
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