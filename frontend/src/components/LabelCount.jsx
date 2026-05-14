import { useState, useEffect } from "react";
import "../styles/Label.css";

const API_BASE = "http://127.0.0.1:5000";

/* ── IoT-23 realistic demo data (used when backend is offline) ── */
const DEMO_DATA = [
  { label: "Benign",                        count: 112043, risk: "safe"     },
  { label: "C&C",                           count:  38210, risk: "critical" },
  { label: "DDoS",                          count:  29874, risk: "critical" },
  { label: "PortScan",                      count:  21503, risk: "high"     },
  { label: "Okiru",                         count:  17682, risk: "high"     },
  { label: "Attack",                        count:  14391, risk: "high"     },
  { label: "FileDownload",                  count:   9204, risk: "medium"   },
  { label: "HeartBeat",                     count:   7843, risk: "medium"   },
  { label: "Torii",                         count:   5612, risk: "high"     },
  { label: "Mirai",                         count:   4330, risk: "critical" },
];

const RISK_META = {
  safe:     { color: "#00e0c8", label: "SAFE",     order: 0 },
  medium:   { color: "#f59e0b", label: "MEDIUM",   order: 1 },
  high:     { color: "#f97316", label: "HIGH",     order: 2 },
  critical: { color: "#ef4444", label: "CRITICAL", order: 3 },
};

/* Assign risk level to a raw label string from the dataset */
function inferRisk(label) {
  const l = label.toLowerCase();
  if (l === "benign" || l === "-")                          return "safe";
  if (l.includes("ddos") || l.includes("c&c") || l.includes("mirai") || l.includes("torii"))
                                                            return "critical";
  if (l.includes("scan") || l.includes("okiru") || l.includes("attack"))
                                                            return "high";
  return "medium";
}

const PALETTE = [
  "#00e0c8","#38bdf8","#a78bfa","#f59e0b",
  "#f97316","#ef4444","#34d399","#e879f9",
  "#facc15","#94a3b8",
];

/* ─────────────────────────────────────────
   SVG Donut Pie
───────────────────────────────────────── */
function PieChart({ data, total }) {
  const [hovered, setHovered] = useState(null);
  const cx = 130, cy = 130, R = 112, ri = 62;
  let angle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const pct = d.count / total;
    const a0 = angle;
    angle += pct * 2 * Math.PI;
    const a1 = angle;
    const large = pct > 0.5 ? 1 : 0;
    const path = [
      `M${cx + ri * Math.cos(a0)},${cy + ri * Math.sin(a0)}`,
      `L${cx + R  * Math.cos(a0)},${cy + R  * Math.sin(a0)}`,
      `A${R},${R} 0 ${large},1 ${cx + R  * Math.cos(a1)},${cy + R  * Math.sin(a1)}`,
      `L${cx + ri * Math.cos(a1)},${cy + ri * Math.sin(a1)}`,
      `A${ri},${ri} 0 ${large},0 ${cx + ri * Math.cos(a0)},${cy + ri * Math.sin(a0)}Z`,
    ].join(" ");
    return { ...d, i, pct, mid: (a0 + a1) / 2, path, color: PALETTE[i % PALETTE.length] };
  });

  const hov = hovered !== null ? slices[hovered] : null;

  return (
    <svg viewBox="0 0 260 260" className="lc-pie-svg">
      <defs>
        <filter id="lcglow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {slices.map((s) => {
        const active = hovered === s.i;
        const ox = active ? Math.cos(s.mid) * 7 : 0;
        const oy = active ? Math.sin(s.mid) * 7 : 0;
        return (
          <path
            key={s.i}
            d={s.path}
            fill={s.color}
            stroke="#060d12"
            strokeWidth="1.5"
            opacity={hovered !== null && !active ? 0.28 : 0.88}
            filter={active ? "url(#lcglow)" : undefined}
            style={{ transform: `translate(${ox}px,${oy}px)`, transition: "all 0.18s ease", cursor: "pointer" }}
            onMouseEnter={() => setHovered(s.i)}
            onMouseLeave={() => setHovered(null)}
          />
        );
      })}

      {hov ? (
        <>
          <text x={cx} y={cy - 12} textAnchor="middle" fill={hov.color}
            fontSize="10" fontFamily="'Share Tech Mono',monospace" letterSpacing="1">
            {hov.label.length > 11 ? hov.label.slice(0,11)+"…" : hov.label}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fill="#e2e8f0"
            fontSize="16" fontFamily="'Share Tech Mono',monospace" fontWeight="700">
            {hov.count.toLocaleString()}
          </text>
          <text x={cx} y={cy + 26} textAnchor="middle" fill="rgba(226,232,240,0.4)"
            fontSize="11" fontFamily="'Share Tech Mono',monospace">
            {(hov.pct * 100).toFixed(1)}%
          </text>
        </>
      ) : (
        <>
          <text x={cx} y={cy - 5} textAnchor="middle" fill="rgba(0,224,200,0.45)"
            fontSize="9" fontFamily="'Share Tech Mono',monospace" letterSpacing="2">TOTAL</text>
          <text x={cx} y={cy + 16} textAnchor="middle" fill="#e2e8f0"
            fontSize="18" fontFamily="'Share Tech Mono',monospace" fontWeight="700">
            {total.toLocaleString()}
          </text>
        </>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────
   SVG Bar Chart
───────────────────────────────────────── */
function BarChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.map(d => d.count));
  const W = 100, H = 100;
  const PL = 11, PR = 2, PT = 3, PB = 18;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;
  const bw  = (chartW / data.length) * 0.62;
  const gap = chartW / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="lc-bar-svg" preserveAspectRatio="none">
      {[0, 0.5, 1].map(t => (
        <line key={t}
          x1={PL} y1={PT + chartH - t * chartH}
          x2={W - PR} y2={PT + chartH - t * chartH}
          stroke="rgba(0,224,200,0.06)" strokeWidth="0.4" />
      ))}

      {data.map((d, i) => {
        const bh  = (d.count / max) * chartH;
        const x   = PL + i * gap + (gap - bw) / 2;
        const y   = PT + chartH - bh;
        const active = hovered === i;
        return (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
            <rect x={x} y={y} width={bw} height={bh}
              fill={PALETTE[i % PALETTE.length]}
              opacity={hovered !== null && !active ? 0.25 : active ? 1 : 0.7}
              rx="0.8"
              style={{ transition: "opacity 0.15s" }} />
            {active && (
              <text x={x + bw / 2} y={y - 1.5} textAnchor="middle"
                fill={PALETTE[i % PALETTE.length]} fontSize="3.5" fontFamily="'Share Tech Mono',monospace">
                {d.count.toLocaleString()}
              </text>
            )}
            <text x={x + bw / 2} y={PT + chartH + 5}
              textAnchor="end"
              fill={active ? PALETTE[i % PALETTE.length] : "rgba(226,232,240,0.3)"}
              fontSize="3" fontFamily="'Share Tech Mono',monospace"
              transform={`rotate(-38,${x + bw / 2},${PT + chartH + 5})`}
              style={{ transition: "fill 0.15s" }}>
              {d.label.length > 10 ? d.label.slice(0,10)+"…" : d.label}
            </text>
          </g>
        );
      })}
      <line x1={PL} y1={PT + chartH} x2={W - PR} y2={PT + chartH}
        stroke="rgba(0,224,200,0.18)" strokeWidth="0.4" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function LabelCount() {
  const [data,     setData]     = useState(DEMO_DATA);   // start with demo immediately
  const [loading,  setLoading]  = useState(true);
  const [demo,     setDemo]     = useState(false);
  const [sortKey,  setSortKey]  = useState("count");
  const [sortDir,  setSortDir]  = useState(-1);
  const [filter,   setFilter]   = useState("all");
  const [searchQ,  setSearchQ]  = useState("");
  const [animIn,   setAnimIn]   = useState(false);

  useEffect(() => {
    /* Try /label-counts first (plural), then /label-count (singular) */
    const tryFetch = async () => {
      for (const endpoint of ["/label-counts", "/label-count"]) {
        try {
          const res = await fetch(`${API_BASE}${endpoint}`);
          if (!res.ok) continue;
          const json = await res.json();

          /* Backend can return:
             { labels: [{label, count, risk}] }          ← preferred
             { label_counts: { "Benign": 112, ... } }    ← alternate flat dict
          */
          if (json.labels && Array.isArray(json.labels) && json.labels.length > 0) {
            setData(json.labels.map(item => ({
              ...item,
              risk: item.risk || inferRisk(item.label),
            })));
            setDemo(false);
            return;
          }

          if (json.label_counts && typeof json.label_counts === "object") {
            const parsed = Object.entries(json.label_counts).map(([label, count]) => ({
              label,
              count: Number(count),
              risk: inferRisk(label),
            })).sort((a, b) => b.count - a.count);
            setData(parsed);
            setDemo(false);
            return;
          }
        } catch (_) {
          /* try next endpoint */
        }
      }
      /* All attempts failed → keep demo data */
      setDemo(true);
    };

    tryFetch().finally(() => {
      setLoading(false);
      setTimeout(() => setAnimIn(true), 60);
    });
  }, []);

  const total = data.reduce((s, d) => s + d.count, 0);

  const sorted = [...data]
    .filter(d => filter === "all" || d.risk === filter)
    .filter(d => d.label.toLowerCase().includes(searchQ.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "label") return sortDir * a.label.localeCompare(b.label);
      if (sortKey === "risk")  return sortDir * ((RISK_META[a.risk]?.order ?? 0) - (RISK_META[b.risk]?.order ?? 0));
      return sortDir * (a.count - b.count);
    });

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(d => d * -1);
    else { setSortKey(k); setSortDir(-1); }
  };

  const riskSummary = Object.entries(RISK_META).map(([key, meta]) => ({
    key, ...meta,
    count:   data.filter(d => d.risk === key).reduce((s, d) => s + d.count, 0),
    classes: data.filter(d => d.risk === key).length,
  }));

  return (
    <div className={`lc-root ${animIn ? "lc-in" : ""}`}>

      {/* ── Header ── */}
      <div className="lc-page-eyebrow">DATASET ANALYSIS</div>
      <h1 className="lc-page-title">LABEL DISTRIBUTION</h1>

      <div className="lc-meta-row">
        <div className="lc-meta-pill">
          <span className="lc-dot teal" />
          {data.length} CLASSES
        </div>
        <div className="lc-meta-pill">
          <span className="lc-dot blue" />
          {total.toLocaleString()} RECORDS
        </div>
        <div className={`lc-meta-pill ${demo ? "warn" : "live"}`}>
          <span className={`lc-dot ${demo ? "amber" : "teal"}`} />
          {demo ? "DEMO DATA · ADD /label-counts TO FLASK" : "LIVE DATA · BACKEND CONNECTED"}
        </div>
      </div>

      {loading ? (
        <div className="lc-loading">
          <div className="lc-spinner" />
          <span>Fetching label counts…</span>
        </div>
      ) : (
        <>
          {/* ── Risk summary strip ── */}
          <div className="lc-risk-strip">
            {riskSummary.map(r => (
              <button
                key={r.key}
                className={`lc-risk-card ${filter === r.key ? "lc-risk-card--active" : ""}`}
                style={{ "--rc": r.color }}
                onClick={() => setFilter(f => f === r.key ? "all" : r.key)}
              >
                <div className="lc-rc-label">{r.label}</div>
                <div className="lc-rc-count">{r.count.toLocaleString()}</div>
                <div className="lc-rc-sub">{r.classes} class{r.classes !== 1 ? "es" : ""}</div>
                <div className="lc-rc-bar-track">
                  <div className="lc-rc-bar-fill" style={{ width: total ? `${(r.count / total) * 100}%` : "0%" }} />
                </div>
              </button>
            ))}
          </div>

          {/* ── Charts row ── */}
          <div className="lc-charts-row">

            {/* Donut pie */}
            <div className="lc-chart-card">
              <div className="lc-chart-label">
                <span className="lc-chart-dot" style={{ "--dc": "#00e0c8" }} />
                DISTRIBUTION
              </div>
              <PieChart data={data} total={total} />
              <div className="lc-legend">
                {data.map((d, i) => (
                  <div className="lc-legend-item" key={i}>
                    <span className="lc-legend-swatch" style={{ background: PALETTE[i % PALETTE.length] }} />
                    <span className="lc-legend-name">{d.label}</span>
                    <span className="lc-legend-pct">{((d.count / total) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="lc-chart-card lc-chart-card--wide">
              <div className="lc-chart-label">
                <span className="lc-chart-dot" style={{ "--dc": "#38bdf8" }} />
                COUNT PER LABEL
              </div>
              <BarChart data={data} />
              <div className="lc-bar-legend">
                {data.map((d, i) => (
                  <div className="lc-bar-legend-item" key={i}>
                    <span className="lc-bar-swatch" style={{ background: PALETTE[i % PALETTE.length] }} />
                    <span className="lc-bar-name">{d.label}</span>
                    <span className="lc-bar-count">{d.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Risk table ── */}
          <div className="lc-table-section">
            <div className="lc-table-topbar">
              <div className="lc-chart-label" style={{ marginBottom: 0 }}>
                <span className="lc-chart-dot" style={{ "--dc": "#a78bfa" }} />
                RISK TABLE
              </div>
              <div className="lc-table-controls">
                <div className="lc-search-wrap">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="lc-search-icon">
                    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <input
                    className="lc-search"
                    placeholder="Filter labels…"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                  />
                </div>
                {filter !== "all" && (
                  <button className="lc-clear" onClick={() => setFilter("all")}>CLEAR ×</button>
                )}
              </div>
            </div>

            <div className="lc-table-wrap">
              <table className="lc-table">
                <thead>
                  <tr>
                    <th className="lc-th lc-th--n">#</th>
                    <th className="lc-th lc-th--sort" onClick={() => toggleSort("label")}>
                      LABEL <span className="lc-sort">{sortKey === "label" ? (sortDir === 1 ? "↑" : "↓") : "↕"}</span>
                    </th>
                    <th className="lc-th lc-th--sort" onClick={() => toggleSort("count")}>
                      COUNT <span className="lc-sort">{sortKey === "count" ? (sortDir === 1 ? "↑" : "↓") : "↕"}</span>
                    </th>
                    <th className="lc-th">SHARE</th>
                    <th className="lc-th lc-th--sort" onClick={() => toggleSort("risk")}>
                      RISK <span className="lc-sort">{sortKey === "risk" ? (sortDir === 1 ? "↑" : "↓") : "↕"}</span>
                    </th>
                    <th className="lc-th lc-th--bar">DISTRIBUTION</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((d, i) => {
                    const pct   = total ? (d.count / total) * 100 : 0;
                    const orig  = data.indexOf(d);
                    const color = PALETTE[orig % PALETTE.length];
                    const rm    = RISK_META[d.risk] || RISK_META.medium;
                    return (
                      <tr key={d.label} className="lc-tr" style={{ animationDelay: `${i * 28}ms` }}>
                        <td className="lc-td lc-td--n">{i + 1}</td>
                        <td className="lc-td lc-td--label">
                          <span className="lc-row-dot" style={{ background: color }} />
                          {d.label}
                        </td>
                        <td className="lc-td lc-td--mono">{d.count.toLocaleString()}</td>
                        <td className="lc-td lc-td--mono">{pct.toFixed(2)}%</td>
                        <td className="lc-td">
                          <span className="lc-badge" style={{ "--bc": rm.color }}>{rm.label}</span>
                        </td>
                        <td className="lc-td lc-td--bar">
                          <div className="lc-mini-track">
                            <div className="lc-mini-fill" style={{ width: `${pct}%`, background: color }} />
                          </div>
                          <span className="lc-mini-pct">{pct.toFixed(1)}%</span>
                        </td>
                      </tr>
                    );
                  })}
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={6} className="lc-td lc-td--empty">No labels match your filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}