import { useEffect, useState } from "react";
import "../styles/AdminMessage.css";

export default function AdminMessageInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/messages"
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data.reverse());
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  if (selectedMessage) {
    return (
      <div className="panel-card fade-in">
        <div className="admin-message-detail">
          <div className="admin-message-title">
            FULL MESSAGE VIEW
          </div>

          <div className="admin-message-grid">
            <div className="admin-message-card">
              <div className="admin-message-label">
                Name
              </div>
              <div className="admin-message-value">
                {selectedMessage.name}
              </div>
            </div>

            <div className="admin-message-card">
              <div className="admin-message-label">
                Email
              </div>
              <div className="admin-message-value">
                {selectedMessage.email}
              </div>
            </div>

            <div className="admin-message-card">
              <div className="admin-message-label">
                Subject
              </div>
              <div className="admin-message-value">
                {selectedMessage.subject}
              </div>
            </div>

            <div className="admin-message-card">
              <div className="admin-message-label">
                Status
              </div>
              <div className="admin-message-pill">
                {selectedMessage.status}
              </div>
            </div>
          </div>

          <div className="admin-message-body">
            <div className="admin-message-label">
              Full Message Content
            </div>

            <div className="admin-message-text">
              {selectedMessage.message}
            </div>
          </div>

          <button
            className="admin-message-back"
            onClick={() => setSelectedMessage(null)}
          >
            ← BACK TO INBOX
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-card fade-in">
      <div className="panel-card-label">
        USER FEEDBACK INBOX
      </div>

      <div className="panel-output">
        {loading ? (
          <div className="panel-loading">
            <span>LOADING USER MESSAGES...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="admin-message-empty">
            <div className="admin-message-empty-icon">
              ✉
            </div>
            <p>No messages available</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="report-table admin-message-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {messages.map((msg, index) => (
                  <tr
                    key={index}
                    className="admin-message-row"
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.subject}</td>
                    <td>
                      <span className="admin-message-status">
                        {msg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}