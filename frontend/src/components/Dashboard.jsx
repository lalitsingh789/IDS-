import React, { useState, useEffect, useRef } from "react";
import "../styles/Dashboard.css";

const API = "http://127.0.0.1:5000/run-model";
const HEALTH = "http://127.0.0.1:5000/health";
const DATASETS_API = "http://127.0.0.1:5000/datasets";
const MODELS_API = "http://127.0.0.1:5000/models";

function Spinner() {
  return (
    <svg
      className="spin-svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="12 26"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function Empty({ text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">+</div>
      <p>{text}</p>
    </div>
  );
}

export default function Dashboard() {
  const [dataset, setDataset] = useState("iot23_combined.csv");
  const [model, setModel] = useState("svm");
  const [curve, setCurve] = useState("");
  const [report, setReport] = useState("");
  const [sampleInput, setSampleInput] = useState("10000");

  const [datasets, setDatasets] = useState([]);
  const [models, setModels] = useState([]);

  const [metrics, setMetrics] = useState(null);
  const [curveGraph, setCurveGraph] = useState(null);
  const [reportGraph, setReportGraph] = useState(null);
  const [reportTable, setReportTable] = useState(null);
  const [headers, setHeaders] = useState([]);

  const [curveLoading, setCurveLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);
  const [logs, setLogs] = useState([]);
  const [clock, setClock] = useState("");

  const logsRef = useRef(null);
  const busy = curveLoading || reportLoading;

  const addLog = (msg, type = "info") => {
    const ts = new Date().toLocaleTimeString(
      "en-US",
      {
        hour12: false,
      }
    );

    setLogs((prev) => [
      ...prev.slice(-80),
      { ts, msg, type },
    ]);
  };

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString(
          "en-US",
          {
            hour12: false,
          }
        )
      );

    tick();

    const id = setInterval(
      tick,
      1000
    );

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    addLog("Dashboard initialized");
    addLog("Loading backend services...");

    fetch(HEALTH)
      .then((r) => r.json())
      .then(() => {
        setBackendOnline(true);
        addLog("Backend online", "ok");
      })
      .catch(() => {
        setBackendOnline(false);
        addLog(
          "Backend offline — start app.py",
          "err"
        );
      });

    fetch(DATASETS_API)
      .then((r) => r.json())
      .then((data) => {
        setDatasets(
          data.datasets || []
        );
        addLog("Datasets loaded", "ok");
      })
      .catch(() => {
        addLog(
          "Failed to load datasets",
          "err"
        );
      });

    fetch(MODELS_API)
      .then((r) => r.json())
      .then((data) => {
        setModels(
          data.models || []
        );
        addLog("Models loaded", "ok");
      })
        .catch(() => {
        addLog(
          "Failed to load models",
          "err"
        );
      });
  }, []);


  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop =
        logsRef.current.scrollHeight;
    }
  }, [logs]);

  const parseSample = () => {
    const v = sampleInput
      .trim()
      .toLowerCase();

    if (v === "all") {
      return "all";
    }

    const n = parseInt(
      v.replace(/,/g, ""),
      10
    );

    if (isNaN(n)) {
      return 10000;
    }

    return Math.max(
      100,
      Math.min(500000, n)
    );
  };

  const callAPI = async (
    extra,
    setLoading
  ) => {
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          dataset,
          model,
          sample_size:
            parseSample(),
          ...extra,
        }),
      });

      const data =
        await res.json();

      if (data.error) {
        addLog(
          "Error: " + data.error,
          "err"
        );
        return null;
      }

      if (data.metrics) {
        setMetrics(
          data.metrics
        );
      }

      return data;
    } catch (err) {
      addLog(
        "Cannot reach backend",
        "err"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const runCurve = async () => {
    if (!curve) {
      addLog(
        "Select a curve type first",
        "warn"
      );
      return;
    }

    setCurveGraph(null);

    const selectedModel =
      models.find(
        (m) =>
          m.value === model
      )?.label || model;

    addLog(
      `Running ${curve.toUpperCase()} for ${selectedModel}`
    );

    const data =
      await callAPI(
        {
          curve,
          report: "",
        },
        setCurveLoading
      );

    if (data?.graph) {
      setCurveGraph(
        data.graph
      );

      addLog(
        "Curve generated ✓",
        "ok"
      );
    } else if (data) {
      addLog(
        "No graph returned",
        "warn"
      );
    }
  };

  const runReport = async () => {
    if (!report) {
      addLog(
        "Select a report type first",
        "warn"
      );
      return;
    }

    setReportGraph(null);
    setReportTable(null);


        addLog(
      `Generating ${report} report`
    );

    const data =
      await callAPI(
        {
          curve: "",
          report,
        },
        setReportLoading
      );

    if (data?.graph) {
      setReportGraph(
        data.graph
      );

      addLog(
        "Report graph ready ✓",
        "ok"
      );
    }

    if (data?.table) {
      setReportTable(
        data.table
      );

      setHeaders(
        data.headers || []
      );

      addLog(
        "Table ready ✓",
        "ok"
      );
    }
  };

  return (
    <div className="ids-root">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sb-logo">
          <svg
            width="34"
            height="34"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M16 2L3 8v9c0 7.5 5.8 14.5 13 16 7.2-1.5 13-8.5 13-16V8L16 2z"
              fill="rgba(0,224,200,0.1)"
              stroke="#00e0c8"
              strokeWidth="1.5"
            />

            <circle
              cx="16"
              cy="15"
              r="5"
              stroke="#00e0c8"
              strokeWidth="1.5"
            />

            <circle
              cx="16"
              cy="15"
              r="2"
              fill="#00e0c8"
            />
          </svg>

          <div>
            <div className="sb-name">
              IDS Sentinel
            </div>

            <div className="sb-sub">
              Intrusion Detection
              <br />
              Dashboard
            </div>
          </div>
        </div>

        <div className="sb-divider" />

        <div className="sb-section-title">
          SYSTEM
        </div>

        <div
          className={`sb-status ${
            backendOnline === true
              ? "online"
              : backendOnline === false
              ? "offline"
              : "checking"
          }`}
        >
          <span className="sb-dot" />

          <div>
            <div className="sb-status-label">
              {backendOnline === true
                ? "Online"
                : backendOnline === false
                ? "Offline"
                : "Checking…"}
            </div>

            <div className="sb-status-sub">
              {backendOnline === true
                ? "API connected"
                : backendOnline === false
                ? "Start app.py"
                : "Connecting"}
            </div>
          </div>
        </div>

        <div className="sb-clock">
          {clock}
        </div>

        <div className="sb-divider" />

        <div className="sb-section-title">
          SELECTIONS
        </div>

        <div className="sb-row">
          <span>Dataset</span>

          <strong title={dataset}>
            {dataset || "—"}
          </strong>
        </div>

        <div className="sb-row">
          <span>Model</span>

          <strong>
            {
              models.find(
                (m) =>
                  m.value === model
              )?.label || "—"
            }
          </strong>
        </div>
        <div className="sb-row">
          <span>Curve</span>

          <strong>
            {curve || "Not set"}
          </strong>
        </div>

        <div className="sb-row">
          <span>Report</span>

          <strong>
            {report || "Not set"}
          </strong>
        </div>
      </aside>

      {/* MAIN */}
      {/* MAIN CONTENT */}
      <main className="ids-main">

        <div className="page-eyebrow">
          NETWORK SECURITY ANALYTICS
        </div>

        <h1 className="page-title">
          Model monitoring and reports
        </h1>

        {/* CONFIGURATION */}
        <div className="block-label">
          <span className="block-dot" />
          CONFIGURATION
        </div>

        {/* SAMPLE SIZE */}
        <div className="config-solo-card">
          <div className="mini-title">
            SAMPLE SIZE
          </div>

          <label className="field-label">
            ENTER SAMPLE SIZE
          </label>

          <input
            className="sample-input"
            type="text"
            value={sampleInput}
            onChange={(e) =>
              setSampleInput(
                e.target.value
              )
            }
            placeholder="e.g. 10000 or all"
            spellCheck={false}
          />

          <p className="sample-hint">
            Example: 10000, 50000,
            100000 or type <strong>all</strong>
          </p>
        </div>

        {/* DATASET + MODEL */}
        <div className="config-pair">

          {/* DATASET CARD */}
          <div className="config-card">
            <div className="mini-title">
              DATASET
            </div>

            <label className="field-label">
              CHOOSE DATASET
            </label>

            <select
              value={dataset}
              onChange={(e) => {
                setDataset(
                  e.target.value
                );

                addLog(
                  "Dataset changed: " +
                    e.target.value
                );
              }}
            >
              {datasets.length === 0 ? (
                <option value="">
                  Loading datasets...
                </option>
              ) : (
                datasets.map((d) => (
                  <option
                    key={d.value}
                    value={d.value}
                  >
                    {d.label}
                  </option>
                ))
              )}
            </select>

            <p className="config-hint">
              Select intrusion detection dataset.
            </p>
          </div>

          {/* MODEL CARD */}
          <div className="config-card">
            <div className="mini-title">
              MODEL
            </div>

            <label className="field-label">
              CHOOSE CLASSIFIER
            </label>

            <select
              value={model}
              onChange={(e) => {
                setModel(
                  e.target.value
                );

                addLog(
                  "Model changed: " +
                    e.target.value
                );
              }}
            >
              {models.length === 0 ? (
                <option value="">
                  Loading models...
                </option>
              ) : (
                models.map((m) => (
                  <option
                    key={m.value}
                    value={m.value}
                  >
                    {m.label}
                  </option>
                ))
              )}
            </select>

            <p className="config-hint">
              Select trained ML model.
            </p>
          </div>
        </div>

                {/* METRICS */}
        <div className="metrics-strip">
          {[
            {
              key: "accuracy",
              label: "ACCURACY",
              color: "#00e0c8",
            },
            {
              key: "precision",
              label: "PRECISION",
              color: "#38bdf8",
            },
            {
              key: "recall",
              label: "RECALL",
              color: "#f59e0b",
            },
            {
              key: "f1",
              label: "F1 SCORE",
              color: "#a78bfa",
            },
          ].map((m) => (
            <div
              className="metric-box"
              key={m.key}
            >
              <div className="metric-box-label">
                {m.label}
              </div>

              <div
                className="metric-box-value"
                style={{
                  color: m.color,
                }}
              >
                {metrics
                  ? `${(
                      metrics[m.key] *
                      100
                    ).toFixed(1)}%`
                  : ""}
              </div>

              <div className="metric-bar-track">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: metrics
                      ? `${metrics[m.key] * 100}%`
                      : "6%",
                    background:
                      m.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ANALYSIS */}
        <div className="block-label">
          <span
            className="block-dot"
            style={{
              background:
                "#38bdf8",
            }}
          />
          ANALYSIS
        </div>

        <div className="panels-row">

          {/* CURVE PANEL */}
          <div className="panel-card">
            <div className="panel-card-label">
              CURVE ANALYSIS
            </div>

            <div className="panel-controls">
              <select
                value={curve}
                onChange={(e) =>
                  setCurve(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select curve type
                </option>

                <option value="roc">
                  ROC Curve
                </option>

                <option value="pr">
                  Precision Recall Curve
                </option>
              </select>

              <button
                className="run-btn"
                onClick={runCurve}
                disabled={busy}
              >
                {curveLoading ? (
                  <>
                    <Spinner />
                    Running
                  </>
                ) : (
                  "Run"
                )}
              </button>
            </div>

            <div className="panel-output">
              {curveLoading ? (
                <div className="panel-loading">
                  <Spinner />
                  <span>
                    Generating curve…
                  </span>
                </div>
              ) : curveGraph ? (
                <img
                  className="result-img fade-in"
                  src={`data:image/png;base64,${curveGraph}`}
                  alt="Curve"
                />
              ) : (
                <Empty text="Select a curve type and run analysis." />
              )}
            </div>
          </div>

                   {/* REPORT PANEL */}
          <div className="panel-card">
            <div className="panel-card-label">
              CLASSIFICATION REPORT
            </div>

            <div className="panel-controls">
              <select
                value={report}
                onChange={(e) =>
                  setReport(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select report type
                </option>

                <option value="graph">
                  Confusion Matrix
                </option>

                <option value="table">
                  Classification Table
                </option>
              </select>

              <button
                className="run-btn run-btn--purple"
                onClick={runReport}
                disabled={busy}
              >
                {reportLoading ? (
                  <>
                    <Spinner />
                    Running
                  </>
                ) : (
                  "Run"
                )}
              </button>
            </div>

            <div className="panel-output">
              {reportLoading ? (
                <div className="panel-loading">
                  <Spinner />
                  <span>
                    Generating report…
                  </span>
                </div>
              ) : reportGraph ? (
                <img
                  className="result-img fade-in"
                  src={`data:image/png;base64,${reportGraph}`}
                  alt="Confusion Matrix"
                />
              ) : reportTable ? (
                <div className="table-scroll fade-in">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Class</th>

                        {headers.map(
                          (h, i) => (
                            <th key={i}>
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {reportTable.map(
                        (row, i) => (
                          <tr key={i}>
                            {row.map(
                              (
                                c,
                                j
                              ) => (
                                <td
                                  key={j}
                                >
                                  {c}
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty text="Select a report type and run analysis." />
              )}
            </div>
          </div>

        </div>

        {/* SYSTEM LOG */}
        <div
          className="block-label"
          style={{
            marginTop: 28,
          }}
        >
          <span
            className="block-dot"
            style={{
              background:
                "#00e0c8",
            }}
          />
          SYSTEM LOG
        </div>

        <div
          className="terminal"
          ref={logsRef}
        >
          {logs.map(
            (l, i) => (
              <div
                className="log-line"
                key={i}
              >
                <span className="log-ts">
                  [{l.ts}]
                </span>

                <span
                  className={`log-msg log-${l.type}`}
                >
                  {l.msg}
                </span>
              </div>
            )
          )}

          <div className="log-cursor">
            <span className="log-prompt">
              ids@sentinel:~$
            </span>

            <span className="log-blink">
              ▌
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}