import { useState, useEffect, useRef } from "react";
import "../styles/Contact.css";

const TOPICS = [
  { value: "code_request",    label: "⟨/⟩  Request Source Code",       desc: "Get the full project codebase"         },
  { value: "bug_report",      label: "⚠   Bug Report",                  desc: "Something isn't working correctly"     },
  { value: "feature_request", label: "◈   Feature Request",             desc: "Suggest a new feature or improvement"  },
  { value: "model_feedback",  label: "⬡   Model Performance Feedback",  desc: "Feedback on ML model accuracy"         },
  { value: "general",         label: "◉   General Inquiry",             desc: "Any other question or comment"         },
];

const PRIORITIES = [
  { value: "low",      label: "LOW",      color: "#00e0c8" },
  { value: "medium",   label: "MEDIUM",   color: "#f59e0b" },
  { value: "high",     label: "HIGH",     color: "#f97316" },
  { value: "critical", label: "CRITICAL", color: "#ef4444" },
];

const TEAM = [
  { name: "Dev Team",      handle: "@ids-dev",     role: "Backend · ML Models",      color: "#00e0c8", avatar: "DT" },
  { name: "Frontend",      handle: "@ids-frontend", role: "React · UI/UX",            color: "#38bdf8", avatar: "FE" },
  { name: "Data Science",  handle: "@ids-data",    role: "Dataset · Analytics",      color: "#a78bfa", avatar: "DS" },
  { name: "Support",       handle: "@ids-support",  role: "General Inquiries",        color: "#f59e0b", avatar: "SP" },
];

function TerminalLine({ text, delay = 0, type = "info" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`ct-term-line ${visible ? "ct-term-line--in" : ""}`}>
      <span className={`ct-term-prefix ct-term-prefix--${type}`}>
        {type === "ok" ? "✓" : type === "warn" ? "!" : type === "err" ? "✗" : "›"}
      </span>
      <span className="ct-term-text">{text}</span>
    </div>
  );
}

function Particle({ x, y, size, opacity }) {
  return (
    <div
      className="ct-particle"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, opacity }}
    />
  );
}

export default function Contact({ user }) {
  const [form, setForm] = useState({
    name:     user?.username || "",
    email:    "",
    topic:    "",
    priority: "medium",
    subject:  "",
    message:  "",
  });

  const [errors,     setErrors]     = useState({});
  const [status,     setStatus]     = useState("idle"); // idle | sending | success | error
  const [charCount,  setCharCount]  = useState(0);
  const [animIn,     setAnimIn]     = useState(false);
  const [particles,  setParticles]  = useState([]);
  const [activeFaq,  setActiveFaq]  = useState(null);
  const [copyStates, setCopyStates] = useState({});

  const terminalRef = useRef(null);
  const MAX_CHARS   = 1000;

  useEffect(() => {
    setTimeout(() => setAnimIn(true), 60);
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x:       Math.random() * 100,
        y:       Math.random() * 100,
        size:    `${Math.random() * 2 + 1}px`,
        opacity: Math.random() * 0.25 + 0.05,
      }))
    );
  }, []);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: "" }));
    if (key === "message") setCharCount(val.length);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.topic)          e.topic   = "Please select a topic";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    else if (form.message.length < 20) e.message = "Message too short (min 20 characters)";
    return e;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errs = validate();

  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    return;
  }

  setStatus("sending");

  try {
    const res = await fetch(
      "http://localhost:5000/api/admin/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          topic: form.topic,
          priority: form.priority,
          subject: form.subject,
          message: form.message,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setStatus("success");

      setForm((p) => ({
        ...p,
        subject: "",
        message: "",
        topic: "",
        priority: "medium",
      }));

      setCharCount(0);

      setTimeout(() => {
        setStatus("idle");
      }, 4000);

    } else {
      setStatus("error");
    }

  } catch (err) {
    console.error("Contact submission failed:", err);
    setStatus("error");

    setTimeout(() => {
      setStatus("idle");
    }, 4000);
  }
};
  const faqs = [
    {
      q: "How do I get the full source code?",
      a: "Select 'Request Source Code' as the topic, fill in your details and message. The dev team will review and share the repository access within 24–48 hours.",
    },
    {
      q: "Which models are included in the project?",
      a: "The project includes SVM, XGBoost, Random Forest, AdaBoost, LightGBM, and MLP Neural Network — all trained on IoT-23, UNR-IDD, and UNSW-NB15 datasets.",
    },
    {
      q: "Can I suggest a new dataset or model?",
      a: "Absolutely. Use the 'Feature Request' topic and describe the dataset/model you'd like added. Include references or links if possible.",
    },
    {
      q: "I found a bug — what info should I include?",
      a: "Include the model name, dataset, sample size, and the exact error message shown in the System Log. Screenshots are very helpful.",
    },
  ];

  const currentTopic    = TOPICS.find(t => t.value === form.topic);
  const currentPriority = PRIORITIES.find(p => p.value === form.priority);
  const isLoading       = status === "sending";

  return (
    <div className={`ct-root ${animIn ? "ct-in" : ""}`}>

      {/* Ambient particles */}
      {particles.map(p => <Particle key={p.id} {...p} />)}

      {/* ── Page header ── */}
      <div className="ct-header">
        <div className="ct-eyebrow">
          <span className="ct-eyebrow-dot" />
          COMMUNICATIONS TERMINAL
        </div>
        <h1 className="ct-title">Contact &amp; Feedback</h1>
        <p className="ct-subtitle">
          Request code access, report issues, or send feedback about IDS Sentinel.
          All transmissions are reviewed by the development team.
        </p>
      </div>

      <div className="ct-layout">

        {/* ══════════════════════════════
            LEFT — Form
        ══════════════════════════════ */}
        <div className="ct-form-col">

          {/* Success state */}
          {status === "success" && (
            <div className="ct-success-banner">
              <div className="ct-success-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#00e0c8" strokeWidth="1.5"/>
                  <path d="M7 12l3.5 3.5L17 8" stroke="#00e0c8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="ct-success-title">TRANSMISSION SENT</div>
                <div className="ct-success-sub">
                  Your message has been received. The team will respond within 24–48 hours.
                </div>
              </div>
              <button className="ct-success-close" onClick={() => setStatus("idle")}>×</button>
            </div>
          )}

          {status === "error" && (
            <div className="ct-error-banner">
              <span>⚠</span>
              <span>Transmission failed — please try again or contact via email directly.</span>
              <button className="ct-success-close" onClick={() => setStatus("idle")}>×</button>
            </div>
          )}

          <form className="ct-form" onSubmit={handleSubmit} noValidate>

            {/* ── Sender info ── */}
            <div className="ct-section-label">
              <span className="ct-section-dot" style={{ "--sd": "#00e0c8" }} />
              SENDER IDENTIFICATION
            </div>

            <div className="ct-row-2">
              <div className="ct-field">
                <label className="ct-label">FULL NAME <span className="ct-req">*</span></label>
                <div className={`ct-input-wrap ${errors.name ? "ct-input-wrap--err" : ""}`}>
                  <svg className="ct-field-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 19c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    className="ct-input"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <span className="ct-err-msg">{errors.name}</span>}
              </div>

              <div className="ct-field">
                <label className="ct-label">EMAIL ADDRESS <span className="ct-req">*</span></label>
                <div className={`ct-input-wrap ${errors.email ? "ct-input-wrap--err" : ""}`}>
                  <svg className="ct-field-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    className="ct-input"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <span className="ct-err-msg">{errors.email}</span>}
              </div>
            </div>

            {/* ── Topic ── */}
            <div className="ct-section-label">
              <span className="ct-section-dot" style={{ "--sd": "#38bdf8" }} />
              REQUEST TYPE
            </div>

            <div className="ct-field">
              <label className="ct-label">SELECT TOPIC <span className="ct-req">*</span></label>
              <div className="ct-topic-grid">
                {TOPICS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    className={`ct-topic-btn ${form.topic === t.value ? "ct-topic-btn--active" : ""}`}
                    onClick={() => set("topic", t.value)}
                    disabled={isLoading}
                  >
                    <span className="ct-topic-label">{t.label}</span>
                    <span className="ct-topic-desc">{t.desc}</span>
                  </button>
                ))}
              </div>
              {errors.topic && <span className="ct-err-msg">{errors.topic}</span>}
            </div>

            {/* ── Priority ── */}
            <div className="ct-field">
              <label className="ct-label">PRIORITY LEVEL</label>
              <div className="ct-priority-row">
                {PRIORITIES.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    className={`ct-priority-btn ${form.priority === p.value ? "ct-priority-btn--active" : ""}`}
                    style={{ "--pc": p.color }}
                    onClick={() => set("priority", p.value)}
                    disabled={isLoading}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Message ── */}
            <div className="ct-section-label">
              <span className="ct-section-dot" style={{ "--sd": "#a78bfa" }} />
              MESSAGE
            </div>

            <div className="ct-field">
              <label className="ct-label">SUBJECT <span className="ct-req">*</span></label>
              <div className={`ct-input-wrap ${errors.subject ? "ct-input-wrap--err" : ""}`}>
                <input
                  className="ct-input"
                  type="text"
                  placeholder="Brief description of your request"
                  value={form.subject}
                  onChange={e => set("subject", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {errors.subject && <span className="ct-err-msg">{errors.subject}</span>}
            </div>

            <div className="ct-field">
              <label className="ct-label">
                DETAILED MESSAGE <span className="ct-req">*</span>
                <span className={`ct-char-count ${charCount > MAX_CHARS * 0.9 ? "ct-char-count--warn" : ""}`}>
                  {charCount}/{MAX_CHARS}
                </span>
              </label>
              <div className={`ct-textarea-wrap ${errors.message ? "ct-input-wrap--err" : ""}`}>
                <textarea
                  className="ct-textarea"
                  placeholder={
                    form.topic === "code_request"
                      ? "Describe what you need — which components, models, or full codebase access. Include your intended use case..."
                      : form.topic === "bug_report"
                      ? "Describe the bug: which model, dataset, sample size, and what error appeared in the system log..."
                      : "Describe your feedback, question, or request in detail..."
                  }
                  value={form.message}
                  onChange={e => set("message", e.target.value)}
                  maxLength={MAX_CHARS}
                  disabled={isLoading}
                  rows={7}
                />
              </div>
              {errors.message && <span className="ct-err-msg">{errors.message}</span>}
            </div>

            {/* ── Submission preview ── */}
            {form.topic && form.subject && (
              <div className="ct-preview">
                <div className="ct-preview-label">TRANSMISSION PREVIEW</div>
                <div className="ct-preview-row">
                  <span>Topic</span>
                  <span>{currentTopic?.label}</span>
                </div>
                <div className="ct-preview-row">
                  <span>Priority</span>
                  <span style={{ color: currentPriority?.color }}>
                    {currentPriority?.label}
                  </span>
                </div>
                <div className="ct-preview-row">
                  <span>Subject</span>
                  <span>{form.subject || "—"}</span>
                </div>
                <div className="ct-preview-row">
                  <span>From</span>
                  <span>{form.name || "—"} · {form.email || "—"}</span>
                </div>
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              className="ct-submit-btn"
              disabled={isLoading || status === "success"}
            >
              {isLoading ? (
                <span className="ct-submit-inner">
                  <span className="ct-btn-spinner" />
                  TRANSMITTING…
                </span>
              ) : (
                <span className="ct-submit-inner">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M2 10l16-8-6 8 6 8-16-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  SEND TRANSMISSION
                </span>
              )}
            </button>

          </form>
        </div>

        {/* ══════════════════════════════
            RIGHT — Info panels
        ══════════════════════════════ */}
        <div className="ct-info-col">

          {/* Team contacts */}
          <div className="ct-panel">
            <div className="ct-panel-title">
              <span className="ct-panel-dot" style={{ "--pd": "#00e0c8" }} />
              TEAM DIRECTORY
            </div>
            <div className="ct-team-list">
              {TEAM.map((t) => (
                <div key={t.handle} className="ct-team-item">
                  <div className="ct-team-avatar" style={{ "--ta": t.color }}>
                    {t.avatar}
                  </div>
                  <div className="ct-team-info">
                    <div className="ct-team-name">{t.name}</div>
                    <div className="ct-team-role">{t.role}</div>
                  </div>
                  <button
                    className="ct-copy-btn"
                    onClick={() => handleCopy(t.handle, t.handle)}
                    title="Copy handle"
                  >
                    {copyStates[t.handle] ? (
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10l4 4 8-8" stroke="#00e0c8" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <span className="ct-team-handle">{t.handle}</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal log */}
          <div className="ct-panel">
            <div className="ct-panel-title">
              <span className="ct-panel-dot" style={{ "--pd": "#38bdf8" }} />
              SYSTEM TERMINAL
            </div>
            <div className="ct-terminal" ref={terminalRef}>
              <TerminalLine text="IDS Sentinel v2.0 — Contact Module" delay={100} />
              <TerminalLine text="Secure channel established" delay={300} type="ok" />
              <TerminalLine text="All fields are encrypted in transit" delay={500} type="ok" />
              <TerminalLine text="Response time: 24–48 hours" delay={700} />
              <TerminalLine text="Code requests reviewed manually" delay={900} type="warn" />
              <TerminalLine text="Ready to receive transmission…" delay={1100} />
              {status === "sending" && (
                <TerminalLine text="Transmitting payload…" type="warn" delay={0} />
              )}
              {status === "success" && (
                <TerminalLine text="Transmission acknowledged ✓" type="ok" delay={0} />
              )}
              {status === "error" && (
                <TerminalLine text="Transmission failed — retry" type="err" delay={0} />
              )}
              <div className="ct-term-cursor">
                <span className="ct-term-prompt">ids@sentinel:~$</span>
                <span className="ct-term-blink">▌</span>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="ct-panel">
            <div className="ct-panel-title">
              <span className="ct-panel-dot" style={{ "--pd": "#a78bfa" }} />
              QUICK ANSWERS
            </div>
            <div className="ct-faq-list">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className={`ct-faq-item ${activeFaq === i ? "ct-faq-item--open" : ""}`}
                >
                  <button
                    className="ct-faq-q"
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="ct-faq-arrow">{activeFaq === i ? "▲" : "▼"}</span>
                  </button>
                  {activeFaq === i && (
                    <div className="ct-faq-a">{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Response time indicators */}
          <div className="ct-panel ct-panel--stats">
            <div className="ct-panel-title">
              <span className="ct-panel-dot" style={{ "--pd": "#f59e0b" }} />
              RESPONSE METRICS
            </div>
            <div className="ct-stats-grid">
              {[
                { label: "Code Requests",  time: "24–48h", color: "#00e0c8", pct: 85 },
                { label: "Bug Reports",    time: "12–24h", color: "#ef4444", pct: 95 },
                { label: "Feature Req.",   time: "48–72h", color: "#a78bfa", pct: 70 },
                { label: "General",        time: "24h",    color: "#f59e0b", pct: 90 },
              ].map((s) => (
                <div key={s.label} className="ct-stat-item">
                  <div className="ct-stat-top">
                    <span className="ct-stat-label">{s.label}</span>
                    <span className="ct-stat-time" style={{ color: s.color }}>{s.time}</span>
                  </div>
                  <div className="ct-stat-bar">
                    <div className="ct-stat-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}