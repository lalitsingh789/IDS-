import { useEffect, useState } from "react";
import AdminMessageInbox from "./AdminMessageInbox";
import AdminUploadPanel from "./AdminUploadPanel";
import AdminAuditLogs from "./AdminAuditLogs";
import "../styles/AdminDashboard.css";

export default function AdminDashboard({ user, onLogout }) {
  const [systemStatus, setSystemStatus] = useState({
    backend: "checking",
    mongodb: "checking",
    dataset: "checking",
    models: "checking",
  });

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    admins: 0,
    students: 0,
    researchers: 0,
    faculty: 0,
  });

  const [clock, setClock] = useState("");

  useEffect(() => {
    fetchDashboardData();

    const timer = setInterval(() => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-GB", {
          hour12: false,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statusRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/system-status"),
        fetch("http://localhost:5000/api/admin/user-stats"),
      ]);

      const statusData = await statusRes.json();
      const statsData = await statsRes.json();

      setSystemStatus(statusData);
      setUserStats(statsData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ids-root">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div>
            <div className="sb-name">
              IDS SENTINEL ADMIN
            </div>
            <div className="sb-sub">
              Secure Operations Command
            </div>
          </div>
        </div>

        <div className="sb-divider" />

        <div className="sb-section-title">
          SYSTEM STATUS
        </div>

        <div className={`sb-status ${systemStatus.backend}`}>
          <div className="sb-dot" />
          <div>
            <div className="sb-status-label">
              BACKEND
            </div>
            <div className="sb-status-sub">
              {systemStatus.backend}
            </div>
          </div>
        </div>

        <div
          className={`sb-status ${
            systemStatus.mongodb === "connected"
              ? "online"
              : "offline"
          }`}
        >
          <div className="sb-dot" />
          <div>
            <div className="sb-status-label">
              MONGODB
            </div>
            <div className="sb-status-sub">
              {systemStatus.mongodb}
            </div>
          </div>
        </div>

        <div className="sb-status online">
          <div className="sb-dot" />
          <div>
            <div className="sb-status-label">
              DATASET
            </div>
            <div className="sb-status-sub">
              {systemStatus.dataset}
            </div>
          </div>
        </div>

        <div className="sb-status online">
          <div className="sb-dot" />
          <div>
            <div className="sb-status-label">
              MODELS
            </div>
            <div className="sb-status-sub">
              {systemStatus.models}
            </div>
          </div>
        </div>

        <div className="sb-section-title">
          LIVE CLOCK
        </div>

        <div className="sb-clock">
          {clock}
        </div>

        <div className="sb-section-title">
          ADMIN PROFILE
        </div>

        <div className="sb-row">
          <span>Name</span>
          <strong>{user?.name || "Admin"}</strong>
        </div>

        <div className="sb-row">
          <span>Email</span>
          <strong>{user?.email || "admin@ids.com"}</strong>
        </div>

        <div className="sb-row">
          <span>Organization</span>
          <strong>{user?.organizationId || "IDS Lab"}</strong>
        </div>

        <div className="sb-row">
          <span>Role</span>
          <strong>{user?.role || "ADMIN"}</strong>
        </div>

        {/* LOGOUT */}
        <button
          className="admin-logout-btn"
          onClick={onLogout}
        >
          🔓 ADMIN LOGOUT
        </button>
      </aside>

      {/* MAIN */}
      <main className="ids-main">
        <div className="page-eyebrow">
          ADMIN CONTROL CENTER
        </div>

        <h1 className="page-title">
          IDS SENTINEL ADMIN DASHBOARD
        </h1>

        <div className="metrics-strip">
          <div className="metric-box">
            <div className="metric-box-label">
              TOTAL USERS
            </div>
            <div className="metric-box-value">
              {userStats.totalUsers}
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{
                  width: "100%",
                  background: "#00e0c8",
                }}
              />
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-box-label">
              ADMINS
            </div>
            <div className="metric-box-value">
              {userStats.admins}
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{
                  width: "75%",
                  background: "#a78bfa",
                }}
              />
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-box-label">
              STUDENTS
            </div>
            <div className="metric-box-value">
              {userStats.students}
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{
                  width: "85%",
                  background: "#38bdf8",
                }}
              />
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-box-label">
              RESEARCHERS
            </div>
            <div className="metric-box-value">
              {userStats.researchers}
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{
                  width: "65%",
                  background: "#4ade80",
                }}
              />
            </div>
          </div>
        </div>

        <div className="panels-row">
          <AdminMessageInbox />
          <AdminUploadPanel />
        </div>

        <AdminAuditLogs />
      </main>
    </div>
  );
}