# 🎨 IDS Dashboard Mockups & UI Specifications

> Comprehensive visual mockups and specifications for all dashboard components

---

## 📑 Table of Contents

1. [Login & Authentication](#1-login--authentication)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Alerts Panel](#3-alerts-panel)
4. [Analytics Dashboard](#4-analytics-dashboard)
5. [Network Map Visualization](#5-network-map-visualization)
6. [Reports Section](#6-reports-section)
7. [Settings & Configuration](#7-settings--configuration)
8. [Mobile View](#8-mobile-view)

---

## 1. Login & Authentication

### Login Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     🛡️ IDS LOGIN PORTAL                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │            INTRUSION DETECTION SYSTEM v1.0              │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ Email Address                                      │ │  │
│  │  │ ┌──────────────────────────────────────────────┐  │ │  │
│  │  │ │ user@example.com                             │  │ │  │
│  │  │ └──────────────────────────────────────────────┘  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ Password                                           │ │  │
│  │  │ ┌──────────────────────────────────────────────┐  │ │  │
│  │  │ │ ••••••••••••••••••                           │  │ │  │
│  │  │ └──────────────────────────────────────────────┘  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ☐ Remember me      🔗 Forgot Password?               │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │         🔓 LOGIN TO DASHBOARD                   │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  Don't have account? Create one here                    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Status: Database connected ✓ | ML Models loaded ✓             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Two-Factor Authentication Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│               🔐 TWO-FACTOR AUTHENTICATION                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Enter the 6-digit code from your authenticator app    │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  [  ]  [  ]  [  ]  [  ]  [  ]  [  ]              │  │  │
│  │  │   1     2     3     4     5     6                 │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │         ✓ VERIFY CODE                        │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  🔗 Don't have code? | 💬 Send via SMS                 │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Dashboard Overview

### Main Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ IDS Dashboard                              @admin | 🌙 Dark | Settings  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ☰ MENU          🏠 Dashboard  📊 Analytics  📋 Reports  ⚙️ Settings        │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 📊 SYSTEM STATUS                    🕐 Last Updated: 2 seconds ago           │
│                                                                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ 🟢 ACTIVE    │ │ 📊 TRAFFIC   │ │ 🚨 ALERTS    │ │ 💚 UPTIME    │        │
│ │ Status: OK   │ │ 1.2 Gbps     │ │ 42 (5 NEW)   │ │ 99.98%       │        │
│ │              │ │ ↑ 12% ↓ 8%   │ │ High: 8      │ │ 47 Days      │        │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 🔴 CRITICAL ALERTS (Last 24 Hours)                    [View All] [Export]   │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ DDoS Attack Detected                              Severity: CRITICAL │ │
│ │ Source: 192.168.1.105 → Destination: 10.0.0.50      Time: 5 min ago    │ │
│ │ Confidence: 99.1% | ML Model: Neural Network        Status: ONGOING    │ │
│ │ Action: Traffic blocked automatically               [Details]          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Brute Force Attack                                Severity: HIGH     │ │
│ │ Source: 203.0.113.45 → SSH Port 22                  Time: 15 min ago   │ │
│ │ Confidence: 98.5% | ML Model: Random Forest         Status: RESOLVED   │ │
│ │ Attempts: 127 in 3 minutes                           [Details]          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Port Scan Detected                                Severity: MEDIUM   │ │
│ │ Source: 198.51.100.25 (Unknown)                     Time: 32 min ago   │ │
│ │ Confidence: 96.8% | ML Model: Isolation Forest      Status: RESOLVED   │ │
│ │ Ports scanned: 1-65535                               [Details]          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 📈 REAL-TIME METRICS                                                         │
│                                                                               │
│ ┌────────────────────────────────────────┐ ┌────────────────────────────┐   │
│ │ Network Traffic (Last 2 Hours)          │ │ Attack Type Distribution   │   │
│ │                                        │ │                            │   │
│ │    Gbps ▲                              │ │ DoS/DDoS    ███████   42%  │   │
│ │      2 │    ╱╲                         │ │ Port Scan   ████      24%  │   │
│ │      1 │   ╱  ╲      ╱╲                │ │ Brute Force ██        12%  │   │
│ │      0 │──╱────╲────╱──╲───────────► │ │ Web Attack  ███       18%  │   │
│ │        └─────────────────────────────┘ │ SQL Inject  █          4%   │   │
│ │        2h    1h    30m   Now           │ │                            │   │
│ └────────────────────────────────────────┘ └────────────────────────────┘   │
│                                                                               │
│ ┌────────────────────────────────────────┐ ┌────────────────────────────┐   │
│ │ Predictions vs Reality (Accuracy 99%)   │ │ Top Source IPs             │   │
│ │                                        │ │                            │   │
│ │ TP: 1240 | FP: 3 | TN: 2850 | FN: 1  │ │ 1. 192.168.1.105   ████ 47 │   │
│ │                                        │ │ 2. 203.0.113.45    ███  34 │   │
│ │ Precision: 99.8% | Recall: 99.9%      │ │ 3. 198.51.100.25   ██   28 │   │
│ │ F1-Score: 99.8%                       │ │ 4. 10.20.30.40     ██   19 │   │
│ └────────────────────────────────────────┘ └────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Alerts Panel

### Alerts Management View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ IDS Dashboard                              @admin | 🌙 Dark | Settings  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ☰ MENU          🏠 Dashboard  📊 Analytics  📋 Reports  ⚙️ Settings        │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 🔔 ALERTS MANAGEMENT                                                         │
│                                                                               │
│ ┌─ Filters ─────────────────────────────────────────────────────────────┐   │
│ │ Status: [All ▼] | Severity: [All ▼] | Date: [Last 7 Days ▼] |      │   │
│ │ Search: ┌─────────────────────┐ | Model: [All ▼]                   │   │
│ │         │ Search alerts...     │                                     │   │
│ │         └─────────────────────┘                                     │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│ Total Alerts: 542 | Unresolved: 8 | Today: 34                              │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ # │ Type        │ Severity │ Source IP      │ Time     │ Confidence │ St │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 1 │ DDoS Attack │ 🔴 CRIT  │ 192.168.1.105  │ 5 min    │ 99.1%      │ 🔴 │
│ │   │ Description: Massive packet flood detected on port 443              │   │
│ │   │ Blocked: Yes | Quarantined: Yes | ML Model: Neural Network         │   │
│ │                                                                          │   │
│ │ 2 │ Brute Force │ 🟠 HIGH  │ 203.0.113.45   │ 15 min   │ 98.5%      │ ✓  │
│ │   │ Description: 127 login attempts in 3 minutes on SSH                 │   │
│ │   │ Blocked: Yes | Quarantined: No | ML Model: Random Forest           │   │
│ │                                                                          │   │
│ │ 3 │ Port Scan   │ 🟡 MED   │ 198.51.100.25  │ 32 min   │ 96.8%      │ ✓  │
│ │   │ Description: Sequential port scanning detected (1-1000)             │   │
│ │   │ Blocked: No | Quarantined: No | ML Model: Isolation Forest         │   │
│ │                                                                          │   │
│ │ 4 │ SQL Inject  │ 🟠 HIGH  │ 10.20.30.40    │ 1 hr     │ 97.2%      │ ✓  │
│ │   │ Description: SQL injection attempt in HTTP request payload          │   │
│ │   │ Blocked: Yes | Quarantined: Yes | ML Model: KNN                    │   │
│ │                                                                          │   │
│ │ 5 │ DDoS Attack │ 🔴 CRIT  │ 172.16.0.100   │ 2 hr     │ 99.3%      │ ✓  │
│ │   │ Description: UDP flood on port 53 (DNS amplification)               │   │
│ │   │ Blocked: Yes | Quarantined: Yes | ML Model: Neural Network         │   │
│ │                                                                          │   │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│ Showing 1-5 of 542 | [< Prev] [1] [2] ... [109] [Next >]                   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Alert Details Modal

```
┌────────────────────────────────────────────────────────────────────────┐
│                        🔔 ALERT DETAILS                            [✕] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ Alert ID: #1024567                    Created: 2026-05-14 17:56:46  │
│ Status: ⏱️ ONGOING                     Last Updated: 2 minutes ago   │
│                                                                        │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ THREAT INFORMATION                                               │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │ Type: DDoS Attack (Denial of Service)                            │ │
│ │ Severity: 🔴 CRITICAL                                            │ │
│ │ ML Confidence: 99.1% (Neural Network Model)                      │ │
│ │ Attack Class: Flooding Attack                                    │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ NETWORK DETAILS                                                  │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │ Source IP: 192.168.1.105            Geolocation: Unknown        │ │
│ │ Dest IP: 10.0.0.50                  Protocol: TCP/UDP          │ │
│ │ Source Port: 54321                  Dest Port: 443             │ │
│ │ Packets: 45,234                     Bytes: 2.1 GB              │ │
│ │ Duration: 4 minutes 32 seconds      Rate: 9.2 Mbps             │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ FEATURE ANALYSIS                                                 │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │ Flow Duration: 272 sec      Fwd Packets: 23,145    Bwd Pkt: 180 │ │
│ │ Fwd Bytes: 1.9 GB           Bwd Bytes: 2.1 MB                   │ │
│ │ Fwd Packet Rate: 85 pkt/s   Bwd Packet Rate: 0.6 pkt/s         │ │
│ │ Protocol: TCP (count: 23145) | UDP (count: 22089)               │ │
│ │ SYN Flags: 0                 FIN Flags: 0          RST: 0        │ │
│ │ PSH Flags: 989               ACK Flags: 180        URG: 0        │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ RESPONSE ACTIONS                                                 │ │
│ ├───────────────��──────────────────────────────────────────────────┤ │
│ │ ☑ Block Source IP                  ☑ Quarantine Traffic        │ │
│ │ ☑ Rate Limit                       ☐ Drop Connection           │ │
│ │ ☑ Alert Sent                       ☑ Log to Database           │ │
│ │ ☐ Trigger Firewall Rule             ☑ Email Notification Sent   │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ ADMIN NOTES                                                      │ │
│ │ ┌──────────────────────────────────────────────────────────────┐ │
│ │ │ Investigating source IP. Possible botnet C&C communication. │ │
│ │ │ Coordinates with ISP for upstream blocking.                 │ │
│ │ └──────────────────────────────────────────────────────────────┘ │
│ │ [Add Note]                                                       │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [Close Alert] [Mark as False Positive] [Update Status] [Generate Report] │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Analytics Dashboard

### Analytics View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ IDS Dashboard                              @admin | 🌙 Dark | Settings  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ☰ MENU          🏠 Dashboard  📊 Analytics  📋 Reports  ⚙️ Settings        │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 📊 ADVANCED ANALYTICS                                                        │
│                                                                               │
│ ┌─ Time Range ─────────────────────────────────────────────────────────┐   │
│ │ [Last 24 Hours ▼] | [Refresh] | Export: [CSV] [PDF] [JSON]          │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 📈 NETWORK TRAFFIC ANALYSIS                                                 │
│                                                                               │
│     Gbps ▲                                                                   │
│       3 │     ╱╲                                                             │
│       2 │    ╱  ╲      ╱╲        ╱╲                                          │
│       1 │───╱────╲────╱──╲──────╱──╲───────────────────────────────────► │
│       0 │                                                                    │
│         └─────────────────────────────────────────────────────────────────┘ │
│         00:00  04:00  08:00  12:00  16:00  20:00  23:59                    │
│                                                                               │
│ Peak Traffic: 3.2 Gbps | Average: 1.8 Gbps | Min: 0.4 Gbps                 │
│ Protocols: TCP 45% | UDP 40% | ICMP 10% | Other 5%                         │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 🎯 ATTACK DETECTION TRENDS                                                  │
│                                                                               │
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────┐    │
│ │ Attack Type Distribution         │ │ Detection Rate Over Time        │    │
│ │                                 │ │                                 │    │
│ │ DoS/DDoS       ██████████ 42%   │ │ Detection %  ▲                  │    │
│ │ Port Scan      ██████ 24%       │ │            99 │    ╱╲╱╲         │    │
│ │ Brute Force    ████ 12%         │ │            95 │───╱  ╲╱╲────► │    │
│ │ Web Attack     ██████ 18%       │ │            90 │                 │    │
│ │ SQL Injection  ██ 4%            │ │               └──────────────   │    │
│ │                                 │ │               Day 1   Day 3   Day7  │    │
│ └─────────────────────────────────┘ └─────────────────────────────────┘    │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 🗺️ GEOLOCATION INTELLIGENCE                                                  │
│                                                                               │
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────┐    │
│ │ Top Attack Origins (24h)         │ │ Top Targeted Services          │    │
│ │                                 │ │                                 │    │
│ │ 🔴 China          ████████ 34%   │ │ 1. HTTP (80)   ████████   32% │    │
│ │ 🔴 Russia         ██████ 23%     │ │ 2. SSH (22)    ███████    28% │    │
│ │ 🔴 Unknown        ████ 18%       │ │ 3. HTTPS (443) ██████     24% │    │
│ │ 🟡 US             ███ 15%        │ │ 4. DNS (53)    ████       12% │    │
│ │ 🟡 EU             ██ 10%         │ │ 5. SMTP (25)   ██          4% │    │
│ │                                 │ │                                 │    │
│ └─────────────────────────────────┘ └─────────────────────────────────┘    │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 🤖 ML MODEL PERFORMANCE COMPARISON                                           │
│                                                                               │
│ Model              │ Accuracy │ Precision │ Recall │ F1-Score │ Inference   │
│ ───────────────────┼──────────┼───────────┼────────┼──────────┼─────────    │
│ Neural Network     │  99.1%   │   98.9%   │ 99.3%  │ 99.1%    │ 12ms        │
│ Random Forest      │  98.5%   │   97.8%   │ 98.2%  │ 98.0%    │  8ms        │
│ KNN                │  97.2%   │   96.5%   │ 97.8%  │ 97.1%    │ 15ms        │
│ Isolation Forest   │  96.8%   │   95.2%   │ 97.5%  │ 96.3%    │  6ms        │
│ Ensemble (Voting)  │  99.5%   │   99.2%   │ 99.6%  │ 99.4%    │ 18ms        │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Network Map Visualization

### Network Topology View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ IDS Dashboard                              @admin | 🌙 Dark | Settings  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ☰ MENU          🏠 Dashboard  📊 Analytics  📋 Reports  ⚙️ Settings        │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 🗺️ NETWORK TOPOLOGY & THREAT VISUALIZATION                                  │
│                                                                               │
│ ┌─ View Options ────────────────────────────────────────────────────────┐   │
│ │ [Topology] [Geo Map] [Flow Analysis] | Zoom: [+] [-] | Filter: [All ▼] │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│                                                                               │
│            🌐 INTERNET                                                       │
│                 │                                                            │
│    ┌────────────┴────────────┐                                              │
│    │                         │                                              │
│  🚪 Firewall              🚪 Firewall                                        │
│    │                         │                                              │
│    └────────────┬────────────┘                                              │
│                 │                                                            │
│         ┌──────────────┐                                                    │
│         │   DMZ ZONE   │                                                    │
│         │              │                                                    │
│    ┌─────────┬─────────┐                                                    │
│    │         │         │                                                    │
│  🌐 WEB    📧 MAIL   💾 DNS                                                 │
│  Server    Server    Server                                                 │
│    │         │         │                                                    │
│    └─────────┴─────────┘                                                    │
│              │                                                              │
│         🛡️ IDS/IPS                                                          │
│              │                                                              │
│    ┌─────────────────────┐                                                  │
│    │  INTERNAL NETWORK   │                                                  │
│    │                     │                                                  │
│  ┌─────┐ ┌─────┐ ┌─────┐                                                   │
│  │  🖥️  │ │  🖥️  │ │  🖥️  │  Workstations (Normal Traffic)                │
│  └─────┘ └─────┘ └─────┘                                                   │
│    192.168.1.x                                                              │
│                                                                               │
│  ┌─────┐ ┌─────┐                                                            │
│  │ 🖥️ 🔴│ │ 🖥️  │  Infected Hosts (Detected)                             │
│  └─────┘ └─────┘                                                            │
│    192.168.1.105  (Ongoing DDoS)                                            │
│                                                                               │
│  ┌──────────────────┐                                                       │
│  │ 📂 File Server   │                                                       │
│  │ 10.0.0.50  🔴    │ (Attack Target)                                       │
│  └──────────────────┘                                                       │
│                                                                               │
│  Legend: 🔴 Under Attack | 🟡 Suspicious | 🟢 Normal | 🖥️ Host | 💾 Server │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Geo Map View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🗺️ GEOGRAPHICAL THREAT MAP                                                   │
│                                                                               │
│  [World Map with threat indicators]                                          │
│                                                                               │
│  🌍 ATTACK ORIGINS (Last 24 Hours)                                           │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │              🌏 WORLD MAP                                            │   │
│  │           [World map visualization]                                  │   │
│  │                                                                      │   │
│  │  🔴 HIGH ACTIVITY REGIONS:                                           │   │
│  │  • China: 45 attacks (34%)         │ 🌐 Zoom: [+] [-]             │   │
│  │  • Russia: 31 attacks (23%)        │ 📍 Center: Global            │   │
│  │  • Unknown: 24 attacks (18%)       │ 🎯 Filter: All Threats      │   │
│  │                                                                      │   │
│  │  🟡 MEDIUM ACTIVITY:                                                │   │
│  │  • US: 20 attacks (15%)            │                              │   │
│  │  • EU: 13 attacks (10%)            │                              │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Reports Section

### Reports Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ IDS Dashboard                              @admin | 🌙 Dark | Settings  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ☰ MENU          🏠 Dashboard  📊 Analytics  📋 Reports  ⚙️ Settings        │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 📋 REPORTS & ANALYSIS                                                        │
│                                                                               │
│ ┌─ Actions ────────────────────────────────────────────────────────────┐   │
│ │ [+ Generate New Report] [Schedule Report] | Filters: [Date ▼] [Type ▼] │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│ ┌──────────────────────────────────────────────────────────────────────────┐│
│ │ 📄 Daily Security Report - May 14, 2026                   [PDF] [Email]  ││
│ ├──────────────────────────────────────────────────────────────────────────┤│
│ │ Generated: 5 hours ago | Last Modified: 2 hours ago                     ││
│ │                                                                          ││
│ │ Summary:                                                                ││
│ │ • Total Alerts: 34  • High/Critical: 8  • Resolved: 26  • Pending: 8   ││
│ │ • Uptime: 99.98%    • Avg Response: 2.3s                               ││
│ │ • Detection Accuracy: 99.1%                                            ││
│ │                                                                          ││
│ │ Key Findings:                                                           ││
│ │ ✓ 2 DDoS attacks successfully blocked                                  ││
│ │ ✓ 1 Brute Force attack prevented                                       ││
│ │ ⚠ 2 Port Scans detected (investigation ongoing)                        ││
│ │                                                                          ││
│ │ Recommendations:                                                        ││
│ │ • Consider rate limiting on ports 22 and 3389                          ││
│ │ • Update WAF rules for Web Application attacks                         ││
│ │ • Review source IP geolocation policy                                  ││
│ │                                                                          ││
│ │ [View Full Report] [Delete] [Duplicate]                                ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
│ ┌──────────────────────────────────────────────────────────────────────────┐│
│ │ 📄 Weekly Security Report - May 8-14, 2026                [PDF] [Email]  ││
│ ├──────────────────────────────────────────────────────────────────────────┤│
│ │ Generated: 2 days ago                                                   ││
│ │                                                                          ││
│ │ Summary:                                                                ││
│ │ • Total Alerts: 238  • High/Critical: 42  • Resolved: 205 • Pending: 33 ││
│ │ • Uptime: 99.95%     • Avg Response: 2.1s                              ││
│ │ • Detection Accuracy: 99.0%                                            ││
│ │                                                                          ││
│ │ [View Full Report] [Delete] [Duplicate]                                ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
│ ┌──────────────────────────────────────────────────────────────────────────┐│
│ │ 📄 Monthly Security Report - May 2026                     [PDF] [Email]  ││
│ ├──────────────────────────────────────────────────────────────────────────┤│
│ │ Generated: 5 days ago                                                   ││
│ │                                                                          ││
│ │ Summary:                                                                ││
│ │ • Total Alerts: 1,042  • High/Critical: 178  • Resolved: 987 • Pend: 55 ││
│ │ • Uptime: 99.97%       • Avg Response: 2.2s                            ││
│ │ • Detection Accuracy: 99.1%                                            ││
│ │                                                                          ││
│ │ [View Full Report] [Delete] [Duplicate]                                ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Report Generation Modal

```
┌────────────────────────────────────────────────────────────────────────┐
│                    📊 GENERATE NEW REPORT                          [✕] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ Report Title:                                                          │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ Custom Security Analysis Report                               │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│ Report Type: ⦿ Daily  ○ Weekly  ○ Monthly  ○ Custom Date Range       │
│                                                                        │
│ Date Range:                                                            │
│ From: [2026-05-14 ▼]  To: [2026-05-14 ▼]                            │
│                                                                        │
│ Include Sections: (Check all that apply)                             │
│ ☑ Executive Summary          ☑ Threat Intelligence                   │
│ ☑ Alert Statistics           ☑ Attack Type Analysis                  │
│ ☑ Performance Metrics        ☑ ML Model Comparison                   │
│ ☑ Geolocation Analysis       ☑ Recommendations                       │
│ ☑ Detailed Alert Log         ☑ Network Map Snapshot                  │
│ ☑ PDF Format                 ☑ Include Charts/Graphs                 │
│                                                                        │
│ Recipients (Email):                                                    │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ admin@company.com, security-team@company.com                  │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│ Schedule: ○ Now  ⦿ Scheduled  [Every Day at 08:00 AM ▼]              │
│                                                                        │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ Preview of Report Structure:                                   │  │
│ │ • Executive Summary (1 page)                                   │  │
│ │ • Key Metrics & KPIs (1 page)                                  │  │
│ │ • Threat Analysis (3 pages)                                    │  │
│ │ • Attack Logs & Details (5 pages)                              │  │
│ │ • Recommendations (1 page)                                     │  │
│ │ Total: ~11 pages, ~8 MB (PDF)                                  │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│ [Generate Report] [Schedule] [Cancel]                                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Settings & Configuration

### Settings Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ IDS Dashboard                              @admin | 🌙 Dark | Settings  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ☰ MENU          🏠 Dashboard  📊 Analytics  📋 Reports  ⚙️ Settings        │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ⚙️ SETTINGS & CONFIGURATION                                                  │
│                                                                               │
│ ┌─ Settings Menu ───────────────────────────────────────────────────────┐   │
│ │ [👤 Profile] [🔒 Security] [🔔 Alerts] [🤖 ML Models] [🌐 API] [🛡️ Advanced]│   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 👤 PROFILE SETTINGS                                                          │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ User Information                                                       │  │
│ │                                                                        │  │
│ │ Full Name: Admin User                [Edit]                          │  │
│ │ Email: admin@company.com              [Edit]                          │  │
│ │ Username: admin                       [Edit]                          │  │
│ │ Role: Administrator                   [View Permissions]              │  │
│ │ Department: Security Operations       [Edit]                          │  │
│ │ Phone: +1 (555) 123-4567              [Edit]                          │  │
│ │ Last Login: 2026-05-14 09:30:12       [View History]                 │  │
│ │                                                                        │  │
│ │ Profile Picture:                                                      │  │
│ │ ┌───────────┐                                                         │  │
│ │ │    👤     │  [Change] [Remove]                                      │  │
│ │ └───────────┘                                                         │  │
│ │                                                                        │  │
│ │ [Save Changes] [Cancel]                                              │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ Preferences                                                            │  │
│ │                                                                        │  │
│ │ Theme: ○ Light  ⦿ Dark  ○ Auto                                        │  │
│ │ Language: [English ▼]                                                 │  │
│ │ Timezone: [UTC-05:00 (EST) ▼]                                         │  │
│ │ Date Format: [MM/DD/YYYY ▼]                                           │  │
│ │ Time Format: [12-hour ▼]                                              │  │
│ │                                                                        │  │
│ │ Email Notifications: ☑ Enabled                                        │  │
│ │ Desktop Notifications: ☑ Enabled                                      │  │
│ │                                                                        │  │
│ │ [Save Preferences]                                                    │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 🔒 SECURITY SETTINGS                                                         │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ Password Management                                                    │  │
│ │                                                                        │  │
│ │ Current Password: ┌──────────────────────────────────────────┐        │  │
│ │                  │ ••••••••••••••••••                        │        │  │
│ │                  └──────────────────────────────────────────┘        │  │
│ │                                                                        │  │
│ │ New Password:     ┌──────────────────────────────────────────┐        │  │
│ │                  │                                          │        │  │
│ │                  └──────────────────────────────────────────┘        │  │
│ │                  Password Strength: 🟡 Medium                        │  │
│ │                                                                        │  │
│ │ Confirm Password: ┌──────────────────────────────────────────┐        │  │
│ │                  │                                          │        │  │
│ │                  └──────────────────────────────────────────┘        │  │
│ │                                                                        │  │
│ │ [Update Password]                                                     │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ Two-Factor Authentication                                              │  │
│ │                                                                        │  │
│ │ Status: ☑ ENABLED (Authenticator App)                                 │  │
│ │ Last Verified: 2026-05-14 09:30:12                                    │  │
│ │                                                                        │  │
│ │ Backup Codes: [View] [Regenerate]                                     │  │
│ │                                                                        │  │
│ │ [Disable 2FA]                                                         │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ Active Sessions                                                        │  │
│ │                                                                        │  │
│ │ Current Session: 🟢 Active (Chrome on Windows) - 192.168.1.50        │  │
│ │ Location: New York, US | Last Activity: 2 minutes ago [Sign Out]     │  │
│ │                                                                        │  │
│ │ Other Sessions:                                                       │  │
│ │ 🔵 Active (Safari on macOS) - 192.168.1.51                           │  │
│ │ Location: New York, US | Last Activity: 1 hour ago [Sign Out]        │  │
│ │                                                                        │  │
│ │ [Sign Out All Other Sessions]                                         │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Alert Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      🔔 ALERT CONFIGURATION                                 │
│                                                                               │
│ ┌─ Alert Rules ────────────────────────────────────────────────────────┐    │
│ │ [+ Add New Rule] | [Default Rules] | [Import] [Export]              │    │
│ └───────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ Rule Name: DDoS Attack Detection                                      │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │ Condition:                                                             │  │
│ │ IF (packet_rate > 10000 pps) AND (flow_duration < 60s)                │  │
│ │ THEN Alert with Severity: CRITICAL                                    │  │
│ │                                                                         │  │
│ │ Threshold:                                                             │  │
│ │ Min Confidence: [95 ▼]%  | Action: [Block & Alert ▼]                 │  │
│ │                                                                         │  │
│ │ Notification Channels: ☑ Email  ☑ SMS  ☑ Slack  ☑ PagerDuty          │  │
│ │ Escalation: ⦿ Immediate  ○ 5 min  ○ 15 min                            │  │
│ │                                                                         │  │
│ │ Enabled: ☑  [Edit] [Delete] [Duplicate]                              │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ Rule Name: Brute Force Attack Detection                               │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │ Condition:                                                             │  │
│ │ IF (failed_login_count > 5 per minute)                                │  │
│ │ THEN Alert with Severity: HIGH                                        │  │
│ │                                                                         │  │
│ │ Enabled: ☑  [Edit] [Delete] [Duplicate]                              │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ Rule Name: Port Scan Detection                                         │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │ Condition:                                                             │  │
│ │ IF (syn_packets_to_multiple_ports > 100)                              │  │
│ │ THEN Alert with Severity: MEDIUM                                      │  │
│ │                                                                         │  │
│ │ Enabled: ☑  [Edit] [Delete] [Duplicate]                              │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### API Key Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        🌐 API KEY MANAGEMENT                                 │
│                                                                               │
│ ┌─ Actions ────────────────────────────────────────────────────────────┐    │
│ │ [+ Generate New Key] | [Documentation]                              │    │
│ └───────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ API Key: ids_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0          │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │ Name: Production API Key                                              │  │
│ │ Status: 🟢 Active                                                     │  │
│ │ Created: 2026-01-15 14:30:00                                          │  │
│ │ Last Used: 2026-05-14 17:45:23                                        │  │
│ │ Requests (24h): 45,234                                                │  │
│ │                                                                         │  │
│ │ Permissions: ☑ Read  ☑ Write  ☑ Delete  ☑ Admin                      │  │
│ │ Rate Limit: 1000 req/min                                              │  │
│ │ IP Whitelist: 192.168.1.0/24, 10.0.0.0/8                             │  │
│ │                                                                         │  │
│ │ [Copy Key] [Rotate] [Edit] [Revoke]                                  │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ API Key: ids_dev_x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9              │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │ Name: Development API Key                                             │  │
│ │ Status: 🟢 Active                                                     │  │
│ │ Created: 2026-02-01 10:15:00                                          │  │
│ │ Last Used: 2026-05-13 16:20:15                                        │  │
│ │ Requests (24h): 8,432                                                 │  │
│ │                                                                         │  │
│ │ [Copy Key] [Rotate] [Edit] [Revoke]                                  │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Mobile View

### Mobile Dashboard (iOS/Android)

```
┌─────────────────────────────┐
│ 🛡️ IDS Dashboard      ☰    │
│ 15:45 ⚡                  │
├─────────────────────────────┤
│                              │
│ 🔴 CRITICAL ALERTS           │
│ Active: 1                    │
│                              │
│ ┌──────────────────────────┐ │
│ │ DDoS Attack              │ │
│ │ Now (5 min ago)          │ │
│ │ Confidence: 99.1%        │ │
│ │ [Details] [Resolve]      │ │
│ └──────────────────────────┘ │
│                              │
│ 📊 SYSTEM STATUS             │
│                              │
│ Status: 🟢 Active            │
│ Traffic: 1.2 Gbps           │
│ Uptime: 99.98%              │
│                              │
│ ┌──────────────────────────┐ │
│ │ Network Traffic           │ │
│ │ ╱╲      ╱╲                │ │
│ │╱  ╲────╱  ╲──────────►   │ │
│ │                           │ │
│ └──────────────────────────┘ │
│                              │
│ 📈 RECENT ALERTS             │
│                              │
│ ⚠️ Brute Force (Resolved)   │
│ ⚠️ Port Scan (Resolved)     │
│ ⚠️ Web Attack (Ongoing)     │
│                              │
│ [View All Alerts]            │
│                              │
├─────────────────────────────┤
│ 🏠  📊  📋  ⚙️              │
├─────────────────────────────┤
│                              │
```

### Mobile Alerts Detail

```
┌─────────────────────────────┐
│ ◄ DDoS Attack Details   ✕   │
├─────────────────────────────┤
│                              │
│ 🔴 CRITICAL                  │
│                              │
│ Alert #1024567               │
│ Status: ONGOING              │
│                              │
│ SOURCE IP                    │
│ 192.168.1.105               │
│ Geolocation: Unknown         │
│                              │
│ TARGET IP                    │
│ 10.0.0.50                   │
│ Service: File Server         │
│                              │
│ METRICS                      │
│ Packets: 45,234              │
│ Bytes: 2.1 GB               │
│ Duration: 4m 32s             │
│ Rate: 9.2 Mbps              │
│                              │
│ CONFIDENCE                   │
│ Model: Neural Network        │
│ Score: 99.1%                │
│                              │
│ ACTIONS TAKEN                │
│ ☑ Blocked                    │
│ ☑ Quarantined                │
│ ☑ Alerted                    │
│                              │
│ [Add Note]                   │
│ ┌────────────────────────┐   │
│ │ Type a note...         │   │
│ └────────────────────────┘   │
│                              │
│ [Close Alert] [Resolve]      │
│                              │
└─────────────────────────────┘
```

---

## 🎨 Color Scheme & Design System

### Color Palette

```
PRIMARY COLORS:
🔵 Primary Blue:        #2563EB
🟢 Success Green:       #10B981
🔴 Danger Red:          #EF4444
🟡 Warning Yellow:      #F59E0B
⚫ Dark Gray:            #1F2937

SEVERITY LEVELS:
🔴 CRITICAL:            #DC2626
🟠 HIGH:                #EA580C
🟡 MEDIUM:              #EAAC4D
🟢 LOW:                 #10B981
⚪ INFO:                #60A5FA

TEXT COLORS:
Primary Text:           #111827
Secondary Text:         #6B7280
Light Text:             #D1D5DB
Light BG:               #F9FAFB

DARK MODE:
Dark BG:                #0F172A
Dark Text:              #F8FAFC
Dark Secondary:         #94A3B8
Dark Border:            #334155
```

### Typography

```
Headlines:    Segoe UI, -apple-system, sans-serif (Bold 24-32px)
Body:         Segoe UI, -apple-system, sans-serif (Regular 14-16px)
Monospace:    'Source Code Pro', monospace (12-14px)
Line Height:  1.5-1.6 for body, 1.2 for headlines
```

### Component States

```
BUTTON STATES:
Default:      Background #2563EB, Text white
Hover:        Background #1D4ED8, Cursor pointer
Active:       Background #1E40AF, Scale 0.98
Disabled:     Background #D1D5DB, Opacity 0.6, Cursor not-allowed

INPUT STATES:
Default:      Border #D1D5DB, Background white
Focus:        Border #2563EB, Box-shadow blue
Error:        Border #EF4444, Background #FEE2E2
Success:      Border #10B981, Background #F0FDF4
```

---

## 📱 Responsive Breakpoints

```
Mobile:       320px - 639px
Tablet:       640px - 1023px
Desktop:      1024px+
Large:        1280px+
```

---

## ✨ Animation & Interactions

```
Transitions:  300-500ms ease-in-out
Hover Effects: Scale 1.02, Shadow increase
Alert Entrance: Slide from top + Fade in (300ms)
Chart Updates: Smooth line transitions (800ms)
Loading State: Spinner rotation (2s infinite)
Toast Notifications: Slide from corner + Auto-dismiss (5s)
Modal Backdrop: Fade in (200ms), Blur background
Page Transitions: Fade + Slide (300ms)
```

---

## 🎯 Key Features Summary

| Component | Features |
|-----------|----------|
| **Dashboard** | Real-time alerts, system status, quick stats, threat visualization |
| **Alerts Panel** | Filter & search, severity levels, detailed view, bulk actions |
| **Analytics** | Traffic graphs, attack trends, geolocation map, model comparison |
| **Network Map** | Topology visualization, threat indicators, geo mapping |
| **Reports** | Auto-generation, scheduling, PDF export, email distribution |
| **Settings** | Profile management, security config, API keys, alert rules |
| **Mobile View** | Responsive design, touch-optimized, critical alerts priority |

---

## 🚀 Implementation Notes

1. **Framework**: React.js 18+ with TypeScript
2. **Charts**: Chart.js, D3.js, or Recharts
3. **Styling**: TailwindCSS + Custom CSS for themes
4. **Real-time**: WebSocket for live alerts & metrics
5. **State Management**: Redux or Context API
6. **Routing**: React Router v6+
7. **Icons**: Font Awesome or Feather Icons
8. **Notifications**: Toast.js or custom notifications
9. **Dark Mode**: CSS variables + localStorage
10. **Responsive**: Mobile-first approach with media queries

---

**Last Updated**: 2026-05-14  
**Version**: 1.0.0  
**Status**: Design Complete ✓
