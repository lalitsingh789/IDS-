import React, { useState, useEffect } from "react";
import "../styles/AttackSearch.css";

const API_FEATURES = "http://127.0.0.1:5000/features";
const API_PREDICT  = "http://127.0.0.1:5000/predict-attack";

// ── Attack metadata for display ──────────────────────────────
const ATTACK_META = {
  "Benign":                      { severity:"safe",     icon:"✔", color:"#4ade80", desc:"Normal traffic — no threat detected." },
  "PartOfAHorizontalPortScan":   { severity:"medium",   icon:"⚡", color:"#f59e0b", desc:"Horizontal port scan — attacker probing multiple hosts on the same port." },
  "Attack":                      { severity:"critical", icon:"☠", color:"#f87171", desc:"Generic attack pattern detected by the model." },
  "C&C":                         { severity:"critical", icon:"☠", color:"#f87171", desc:"Command & Control traffic — device may be part of a botnet." },
  "C&C-HeartBeat":               { severity:"critical", icon:"☠", color:"#f87171", desc:"C2 heartbeat — malware periodically checking in with server." },
  "C&C-Mirai":                   { severity:"critical", icon:"☠", color:"#f87171", desc:"Mirai botnet C2 communication detected." },
  "C&C-Torii":                   { severity:"critical", icon:"☠", color:"#f87171", desc:"Torii botnet C2 channel — advanced persistent IoT malware." },
  "DDoS":                        { severity:"critical", icon:"☠", color:"#f87171", desc:"Distributed Denial of Service flood — resource exhaustion attack." },
  "FileDownload":                 { severity:"high",    icon:"⚠", color:"#fb923c", desc:"Suspicious file download — possible malware delivery." },
  "Heartbeat":                   { severity:"medium",   icon:"◉", color:"#a78bfa", desc:"Periodic keepalive — C2 stay-alive beacon." },
  "Okiru":                       { severity:"critical", icon:"☠", color:"#f87171", desc:"Okiru/Satori IoT botnet variant." },
  "Torii":                       { severity:"critical", icon:"☠", color:"#f87171", desc:"Torii botnet — stealthy data exfiltration malware." },
  "Mirai":                       { severity:"critical", icon:"☠", color:"#f87171", desc:"Mirai botnet — large-scale IoT DDoS malware." },
};

const SEV_LABELS = {
  safe:     { label:"Safe",     bg:"rgba(74,222,128,0.12)",  border:"rgba(74,222,128,0.35)"  },
  medium:   { label:"Medium",   bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.35)"  },
  high:     { label:"High",     bg:"rgba(251,146,60,0.12)",  border:"rgba(251,146,60,0.35)"  },
  critical: { label:"Critical", bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.35)" },
};

function getMeta(label) {
  if (!label) return null;
  // exact match first
  if (ATTACK_META[label]) return { name: label, ...ATTACK_META[label] };
  // partial match
  for (const [key, val] of Object.entries(ATTACK_META)) {
    if (label.toLowerCase().includes(key.toLowerCase())) return { name: key, ...val };
  }
  return { name: label, severity:"high", icon:"⚠", color:"#fb923c", desc:"Anomalous traffic pattern detected." };
}

// ── Known preset values keyed by common column names ─────────
// These cover the most common IoT-23 column names.
// Any column NOT in a preset gets value 0.
const PRESET_VALUES = {
  "Normal HTTP": {
    duration:1.2,   orig_bytes:512,  resp_bytes:2048, orig_pkts:5,  resp_pkts:8,
    orig_ip_bytes:620, resp_ip_bytes:2200, missed_bytes:0, orig_port:54321, resp_port:80, proto:0,
    // Zeek booleans / flags
    local_orig:1, local_resp:1, conn_state:1,
  },
  "Port Scan": {
    duration:0.001, orig_bytes:0,    resp_bytes:0,    orig_pkts:1,  resp_pkts:0,
    orig_ip_bytes:40, resp_ip_bytes:0, missed_bytes:0, orig_port:54000, resp_port:22, proto:0,
    local_orig:1, local_resp:0, conn_state:0,
  },
  "DDoS UDP": {
    duration:0.0,   orig_bytes:800,  resp_bytes:0,    orig_pkts:20, resp_pkts:0,
    orig_ip_bytes:900, resp_ip_bytes:0, missed_bytes:0, orig_port:1337, resp_port:53, proto:1,
    local_orig:0, local_resp:1, conn_state:0,
  },
  "C&C Beacon": {
    duration:30,    orig_bytes:120,  resp_bytes:80,   orig_pkts:3,  resp_pkts:2,
    orig_ip_bytes:200, resp_ip_bytes:160, missed_bytes:0, orig_port:49152, resp_port:443, proto:0,
    local_orig:1, local_resp:0, conn_state:1,
  },
  "File Download": {
    duration:5.4,   orig_bytes:200,  resp_bytes:95000, orig_pkts:6, resp_pkts:80,
    orig_ip_bytes:400, resp_ip_bytes:96400, missed_bytes:0, orig_port:51234, resp_port:80, proto:0,
    local_orig:1, local_resp:0, conn_state:1,
  },
  "Okiru Botnet": {
    duration:0.003, orig_bytes:0,    resp_bytes:0,    orig_pkts:1,  resp_pkts:0,
    orig_ip_bytes:40, resp_ip_bytes:0, missed_bytes:0, orig_port:62000, resp_port:23, proto:0,
    local_orig:0, local_resp:1, conn_state:0,
  },
};

// ── Group column names for the form UI ───────────────────────
function groupFeatures(cols) {
  const VOLUME = ["bytes","pkts","ip_bytes","missed"];
  const TIME   = ["duration","ts"];
  const PORT   = ["port","proto"];
  const FLAG   = ["local","bool","state","flag","history"];

  const groups = { "Time": [], "Volume": [], "Port / Proto": [], "Flags": [], "Other": [] };

  cols.forEach(col => {
    const c = col.toLowerCase();
    if (FLAG.some(k => c.includes(k)))   groups["Flags"].push(col);
    else if (TIME.some(k => c.includes(k)))   groups["Time"].push(col);
    else if (PORT.some(k => c.includes(k)))   groups["Port / Proto"].push(col);
    else if (VOLUME.some(k => c.includes(k))) groups["Volume"].push(col);
    else groups["Other"].push(col);
  });

  return Object.entries(groups).filter(([,v]) => v.length > 0);
}

// ── Main component ────────────────────────────────────────────
export default function AttackSearch() {
  const [features,   setFeatures]   = useState([]);   // column names from backend
  const [stats,      setStats]      = useState({});   // per-column min/max/example
  const [form,       setForm]       = useState({});   // current input values
  const [result,     setResult]     = useState(null);
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(true);
  const [error,      setError]      = useState("");

  // ── fetch real feature columns on mount ─────────────────────
  useEffect(() => {
    fetch(API_FEATURES)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setFeatures(data.features);
        setStats(data.stats || {});
        // initialise form with zeros
        const init = {};
        data.features.forEach(f => { init[f] = ""; });
        setForm(init);
      })
      .catch(() => setError("Cannot reach backend — make sure app.py is running."))
      .finally(() => setFetching(false));
  }, []);

  // ── apply preset ─────────────────────────────────────────────
  const applyPreset = name => {
    const vals = PRESET_VALUES[name] || {};
    const next = {};
    features.forEach(f => {
      // match by exact key or partial (e.g. "id.orig_p" matches "orig_port")
      let matched = null;
      for (const [k, v] of Object.entries(vals)) {
        if (f === k || f.endsWith(k) || f.startsWith(k) ||
            f.replace(/[^a-z]/g,"").includes(k.replace(/[^a-z]/g,""))) {
          matched = v; break;
        }
      }
      next[f] = matched !== null ? String(matched) : "";
    });
    setForm(next);
    setResult(null);
    setError("");
  };

  const clearForm = () => {
    const blank = {};
    features.forEach(f => { blank[f] = ""; });
    setForm(blank);
    setResult(null);
    setError("");
  };

  // ── submit ────────────────────────────────────────────────────
  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    // Build payload — blank → 0
    const payload = {};
    features.forEach(f => {
      const v = parseFloat(form[f]);
      payload[f] = isNaN(v) ? 0 : v;
    });

    try {
      const res  = await fetch(API_PREDICT, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }

      const meta  = getMeta(data.prediction);
      const entry = {
        id:         Date.now(),
        prediction: data.prediction,
        confidence: data.confidence ?? null,
        meta,
        ts: new Date().toLocaleTimeString("en-US", { hour12: false }),
      };
      setResult(entry);
      setHistory(prev => [entry, ...prev].slice(0, 10));
    } catch {
      setError("Cannot reach backend — make sure app.py is running.");
    } finally {
      setLoading(false);
    }
  };

  const groups = groupFeatures(features);

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="as-root">

      <div className="as-page-eyebrow">NETWORK SECURITY ANALYTICS</div>
      <h1 className="as-page-title">Attack Type Search</h1>
      <p className="as-page-desc">
        Enter network traffic features below. The trained SVM model will
        classify the connection and predict the attack type.
      </p>

      {fetching && (
        <div className="as-fetching">
          <LoadSpinner/> Loading feature columns from backend…
        </div>
      )}

      {!fetching && (
        <div className="as-layout">

          {/* ════ LEFT — form ════ */}
          <div className="as-left">

            {/* presets */}
            <div className="as-block-label"><span className="as-dot"/>QUICK PRESETS</div>
            <div className="as-presets">
              {Object.keys(PRESET_VALUES).map(name => (
                <button key={name} className="preset-btn" onClick={() => applyPreset(name)}>
                  {name}
                </button>
              ))}
              <button className="preset-btn preset-btn--clear" onClick={clearForm}>Clear all</button>
            </div>

            {/* field groups */}
            {error && <div className="as-error"><span>⚠</span>{error}</div>}

            {groups.map(([groupName, cols]) => (
              <div key={groupName} className="as-field-group">
                <div className="as-block-label" style={{ marginTop:20 }}>
                  <span className="as-dot" style={{ background:"#38bdf8" }}/>
                  {groupName.toUpperCase()}
                </div>
                <div className="as-fields-grid">
                  {cols.map(col => {
                    const s = stats[col];
                    const placeholder = s ? `e.g. ${s.example}` : "0";
                    return (
                      <div key={col} className="as-field">
                        <label className="as-field-label" title={s ? `min: ${s.min}  max: ${s.max}  mean: ${s.mean}` : col}>
                          {col}
                          {s && <span className="as-hint" title={`min:${s.min} max:${s.max}`}>ⓘ</span>}
                        </label>
                        <input
                          className={`as-input${form[col] !== "" ? " filled" : ""}`}
                          type="number"
                          step="any"
                          placeholder={placeholder}
                          value={form[col] ?? ""}
                          onChange={e => {
                            setForm(prev => ({ ...prev, [col]: e.target.value }));
                            setError("");
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              className={`as-run-btn${loading ? " loading" : ""}`}
              onClick={handlePredict}
              disabled={loading || fetching}
            >
              {loading
                ? <><LoadSpinner size={16}/>&nbsp;Analysing…</>
                : <><span className="as-run-icon">⬡</span>Predict Attack Type</>
              }
            </button>

          </div>

          {/* ════ RIGHT — result ════ */}
          <div className="as-right">

            <div className="as-block-label">
              <span className="as-dot" style={{ background:"#a78bfa" }}/>PREDICTION RESULT
            </div>

            <div className={`as-result-card${result ? ` sev-${result.meta?.severity}` : ""}`}>
              {loading ? (
                <div className="as-result-loading">
                  <LoadSpinner size={36}/>
                  <span>Running SVM model…</span>
                </div>
              ) : result ? (
                <ResultBody result={result}/>
              ) : (
                <div className="as-result-empty">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="#1e3a52" strokeWidth="2"/>
                    <path d="M16 24l6 6 10-12" stroke="#1e3a52" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>Fill in the features or pick a<br/>preset, then click <strong>Predict</strong></p>
                </div>
              )}
            </div>

            {/* history */}
            {history.length > 0 && (
              <>
                <div className="as-block-label" style={{ marginTop:20 }}>
                  <span className="as-dot" style={{ background:"#f59e0b" }}/>SEARCH HISTORY
                </div>
                <div className="as-history">
                  {history.map(h => (
                    <div key={h.id} className="ah-item"
                      style={{ borderLeftColor: h.meta?.color }}
                      onClick={() => setResult(h)}>
                      <span className="ah-icon" style={{ color: h.meta?.color }}>{h.meta?.icon}</span>
                      <div className="ah-info">
                        <div className="ah-name" style={{ color: h.meta?.color }}>{h.meta?.name || h.prediction}</div>
                        <div className="ah-sub">{h.prediction} · {h.ts}</div>
                      </div>
                      {h.confidence !== null && (
                        <span className="ah-conf" style={{ color: h.meta?.color }}>
                          {(h.confidence*100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// ── Result body ───────────────────────────────────────────────
function ResultBody({ result }) {
  const { meta, prediction, confidence, ts } = result;
  const sev = SEV_LABELS[meta?.severity] || SEV_LABELS.high;
  return (
    <div className="as-result-body fade-in">
      {/* severity banner */}
      <div className="sev-banner" style={{ background: sev.bg, borderColor: sev.border }}>
        <span className="sev-dot" style={{ background: meta?.color }}/>
        <span className="sev-text" style={{ color: meta?.color }}>{sev.label} Threat</span>
      </div>

      {/* icon */}
      <div className="ar-icon" style={{ color: meta?.color }}>{meta?.icon}</div>

      {/* name */}
      <div className="ar-name" style={{ color: meta?.color }}>
        {meta?.name || prediction}
      </div>

      {/* raw label */}
      <div className="ar-raw">Raw label: <code>{prediction}</code></div>

      {/* description */}
      <p className="ar-desc">{meta?.desc}</p>

      {/* confidence */}
      {confidence !== null && confidence !== undefined && (
        <div className="ar-confidence">
          <span className="arc-label">Confidence</span>
          <div className="arc-track">
            <div className="arc-fill"
              style={{ width:`${(confidence*100).toFixed(1)}%`, background: meta?.color }}/>
          </div>
          <span className="arc-pct" style={{ color: meta?.color }}>
            {(confidence*100).toFixed(1)}%
          </span>
        </div>
      )}

      <div className="ar-ts">Predicted at {ts}</div>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────
function LoadSpinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16"
      style={{ flexShrink:0, display:"inline-block", verticalAlign:"middle" }}>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor"
        strokeWidth="2" strokeDasharray="12 26" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
          from="0 8 8" to="360 8 8" dur="0.8s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}