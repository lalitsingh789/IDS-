import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import AttackSearch from "./components/AttackSearch";
import LabelCount from "./components/LabelCount";
import Login from "./components/Login";
import Register from "./components/Register";
import CodeViewer from "./components/CodeViewer";
import AdminLogin from "./components/AdminLogin";
import Contact from "./components/Contact";
import UserProfile from "./components/UserProfile";
import "./styles/App.css";

const PAGES = [
  { id: "dashboard", label: "Model Reports", icon: "◈" },
  { id: "search", label: "Attack Search", icon: "⬡" },
  { id: "labels", label: "Label Distribution", icon: "◉" },
  { id: "code", label: "Code Viewer", icon: "📄" },
  { id: "contact", label: "Contact Support", icon: "✉" },
  { id: "profile", label: "My Profile", icon: "👤" },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);

        if (parsedUser.role === "admin") {
          setPage("admin");
        } else {
          setPage("dashboard");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Login handler
  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);

    if (userData.role === "admin") {
      setPage("admin");
    } else {
      setPage("dashboard");
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
    setAuthPage("login");
    setPage("dashboard");
  };

  // =========================
  // AUTH ROUTING
  // =========================
  if (!isAuthenticated) {
    if (authPage === "login") {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthPage("register")}
          onSwitchToAdmin={() => setAuthPage("admin")}
        />
      );
    }

    if (authPage === "admin") {
      return (
        <AdminLogin
          onLogin={handleLogin}
          onSwitchToUser={() => setAuthPage("login")}
        />
      );
    }

    if (authPage === "register") {
      return (
        <Register
          onSwitchToLogin={() => setAuthPage("login")}
        />
      );
    }
  }

  // =========================
  // ADMIN ROUTING
  // =========================
  if (user?.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // =========================
  // NORMAL USER ROUTING
  // =========================
  return (
    <div className="app-shell">
      <div className="app-tabs">
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={`app-tab ${page === p.id ? "active" : ""}`}
            onClick={() => setPage(p.id)}
          >
            <span className="app-tab-icon">
              {p.icon}
            </span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="app-page">
        {page === "dashboard" && (
          <Dashboard user={user} />
        )}

        {page === "search" && (
          <AttackSearch user={user} />
        )}

        {page === "labels" && (
          <LabelCount />
        )}

        {page === "code" && (
          <CodeViewer />
        )}

        {page === "contact" && (
          <Contact user={user} />
        )}

        {page === "profile" && (
          <UserProfile
            user={user}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}