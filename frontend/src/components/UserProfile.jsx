import { useEffect, useState } from "react";
import "../styles/UserProfile.css";

export default function UserProfile({ user, onLogout }) {
  const [time, setTime] = useState("");
  const [systemStatus] = useState("ONLINE");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour12: false,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="user-profile-root">
      {/* LEFT SIDEBAR */}
      <aside className="up-sidebar">
        <div className="up-logo">
          <div className="up-logo-icon">🛡</div>

          <div>
            <div className="up-logo-title">
              IDS Sentinel
            </div>

            <div className="up-logo-sub">
              User Control Panel
            </div>
          </div>
        </div>

        <div className="up-section-title">
          SYSTEM STATUS
        </div>

        <div className="up-status-card">
          <div className="up-status-dot" />

          <div>
            <div className="up-status-main">
              {systemStatus}
            </div>

            <div className="up-status-sub">
              API Connected
            </div>
          </div>
        </div>

        <div className="up-clock">
          {time}
        </div>

        <div className="up-section-title">
          USER PROFILE
        </div>

        <div className="up-profile-card">
          <div className="up-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="up-name">
            {user?.name || "Unknown User"}
          </div>

          <div className="up-role">
            {user?.role?.toUpperCase() || "STANDARD USER"}
          </div>
        </div>

        <div className="up-info-list">
          <div className="up-info-row">
            <span>Name</span>
            <strong>{user?.name || "-"}</strong>
          </div>

          <div className="up-info-row">
            <span>Email</span>
            <strong>{user?.email || "-"}</strong>
          </div>

          <div className="up-info-row">
            <span>Organization</span>
            <strong>
              {user?.organizationId || "-"}
            </strong>
          </div>

          <div className="up-info-row">
            <span>Research</span>
            <strong>
              {user?.researchArea || "-"}
            </strong>
          </div>
        </div>

        <button
          className="up-logout-btn"
          onClick={onLogout}
        >
          🔓 LOGOUT
        </button>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className="up-main">
        <div className="up-eyebrow">
          USER ACCOUNT ANALYTICS
        </div>

        <h1 className="up-title">
          Profile Monitoring Dashboard
        </h1>

        {/* METRICS */}
        <div className="up-metrics">
          <div className="up-metric-card">
            <div className="up-metric-label">
              ACCOUNT STATUS
            </div>
            <div className="up-metric-value green">
              ACTIVE
            </div>
          </div>

          <div className="up-metric-card">
            <div className="up-metric-label">
              LOGIN ROLE
            </div>
            <div className="up-metric-value cyan">
              USER
            </div>
          </div>

          <div className="up-metric-card">
            <div className="up-metric-label">
              ACCESS LEVEL
            </div>
            <div className="up-metric-value purple">
              STANDARD
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="up-grid">
          {/* ACCOUNT INFO */}
          <div className="up-panel">
            <div className="up-panel-title">
              ACCOUNT INFORMATION
            </div>

            <div className="up-data-grid">
              <div className="up-data-card">
                <span>FULL NAME</span>
                <h3>{user?.name || "Unknown User"}</h3>
              </div>

              <div className="up-data-card">
                <span>EMAIL ADDRESS</span>
                <h3>{user?.email || "Not available"}</h3>
              </div>

              <div className="up-data-card">
                <span>ORGANIZATION ID</span>
                <h3>
                  {user?.organizationId || "Not assigned"}
                </h3>
              </div>

              <div className="up-data-card">
                <span>RESEARCH AREA</span>
                <h3>
                  {user?.researchArea || "General"}
                </h3>
              </div>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="up-panel">
            <div className="up-panel-title">
              USER ACTIVITY LOG
            </div>

            <div className="up-activity-list">
              <div className="up-activity-item">
                <div className="up-activity-dot cyan" />
                <div>
                  <strong>Login successful</strong>
                  <p>User session authenticated</p>
                </div>
              </div>

              <div className="up-activity-item">
                <div className="up-activity-dot green" />
                <div>
                  <strong>Dashboard accessed</strong>
                  <p>IDS dashboard initialized</p>
                </div>
              </div>

              <div className="up-activity-item">
                <div className="up-activity-dot purple" />
                <div>
                  <strong>Profile synced</strong>
                  <p>Account details loaded</p>
                </div>
              </div>

              <div className="up-activity-item">
                <div className="up-activity-dot orange" />
                <div>
                  <strong>Monitoring active</strong>
                  <p>Threat detection enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PERMISSIONS */}
        <div className="up-panel full-width">
          <div className="up-panel-title">
            USER ACCESS PERMISSIONS
          </div>

          <div className="up-permission-grid">
            <div className="up-permission-card">
              <span>MODEL REPORTS</span>
              <strong>ENABLED</strong>
            </div>

            <div className="up-permission-card">
              <span>ATTACK SEARCH</span>
              <strong>ENABLED</strong>
            </div>

            <div className="up-permission-card">
              <span>LABEL ANALYTICS</span>
              <strong>ENABLED</strong>
            </div>

            <div className="up-permission-card">
              <span>CODE VIEWER</span>
              <strong>ENABLED</strong>
            </div>

            <div className="up-permission-card">
              <span>ADMIN CONTROLS</span>
              <strong>RESTRICTED</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}