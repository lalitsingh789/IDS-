import { useEffect, useState } from "react";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();

    const interval = setInterval(() => {
      fetchAuditLogs();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/audit-logs"
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setLogs(data.reverse());
      }
    } catch (err) {
      console.error("Audit logs fetch failed", err);
    }

    setLoading(false);
  };

  return (
    <div className="fade-in">
      <div className="block-label">
        <span className="block-dot" />
        SYSTEM AUDIT TERMINAL
      </div>

      <div className="terminal">
        {loading ? (
          <div className="log-line">
            <span className="log-ts">[BOOT]</span>
            <span className="log-msg log-info">
              INITIALIZING AUDIT MONITOR...
            </span>
          </div>
        ) : logs.length === 0 ? (
          <>
            <div className="log-line">
              <span className="log-ts">[SYS]</span>
              <span className="log-msg log-warn">
                NO AUDIT EVENTS RECORDED
              </span>
            </div>

            <div className="log-cursor">
              <span className="log-prompt">&gt;</span>
              <span className="log-blink">_</span>
            </div>
          </>
        ) : (
          <>
            {logs.map((log, index) => (
              <div key={index} className="log-line">
                <span className="log-ts">
                  [
                  {log.time
                    ? new Date(log.time).toLocaleTimeString(
                        "en-GB",
                        { hour12: false }
                      )
                    : "SYS"}
                  ]
                </span>

                <span
                  className={`log-msg ${
                    log.action?.toLowerCase().includes("uploaded")
                      ? "log-ok"
                      : log.action?.toLowerCase().includes("failed")
                      ? "log-err"
                      : "log-info"
                  }`}
                >
                  {log.action || "SYSTEM EVENT"}

                  {log.file && (
                    <> → {log.file}</>
                  )}
                </span>
              </div>
            ))}

            <div className="log-cursor">
              <span className="log-prompt">&gt;</span>
              <span className="log-blink">_</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}