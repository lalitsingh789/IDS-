# IDS - Intrusion Detection System

<div align="center">

![IDS Logo](https://img.shields.io/badge/IDS-Intrusion%20Detection%20System-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-orange?style=flat-square)
![Status](https://img.shields.io/badge/status-Active-brightgreen?style=flat-square)

A comprehensive Intrusion Detection System built with modern web technologies for real-time network threat detection and analysis.

[Features](#features) • [Screenshots](#screenshots) • [Installation](#installation) • [Usage](#usage) • [Architecture](#architecture)

</div>

---

## 📸 Screenshots

### Frontend Dashboard
![Frontend Screenshot](./docs/assets/frontend-screenshot.png)
*Main dashboard interface showing real-time threat detection and network monitoring*

---

## ✨ Features

- **Real-Time Monitoring**: Live network traffic analysis and threat detection
- **Dashboard Analytics**: Comprehensive visualization of security metrics
- **Threat Detection**: Advanced algorithms for identifying suspicious patterns
- **Alert System**: Instant notifications for detected threats
- **Historical Data**: Detailed logs and historical analysis
- **User Authentication**: Secure login and role-based access control
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **API Integration**: RESTful APIs for system integration

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building interactive interfaces
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js / D3.js** - Data visualization libraries
- **Axios** - HTTP client for API requests

### Backend
- **Node.js / Python** - Server runtime
- **Express.js / FastAPI** - Web framework
- **PostgreSQL / MongoDB** - Database
- **Socket.io** - Real-time communication

### DevOps & Tools
- **Docker** - Containerization
- **Git** - Version control

---

## 📋 Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git**
- **Python** 3.8+ (if backend uses Python)
- **Docker** (optional, for containerized deployment)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/lalitsingh789/IDS-.git
cd IDS-
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
pip install -r requirements.txt
# or
npm install
```

### 4. Environment Setup

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=IDS

# Backend
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/ids_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## 🏃 Running the Application

### Development Mode

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
npm start
# or for Python
python app.py
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

---

## 📚 Project Structure

```
IDS-/
├── frontend/                    # React + Vite frontend application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── styles/             # Global styles
│   │   └── App.jsx
│   ├── public/                 # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Backend server
│   ├── routes/                 # API routes
│   ├── controllers/            # Business logic
│   ├── models/                 # Database models
│   ├── middleware/             # Express middleware
│   ├── config/                 # Configuration files
│   └── server.js
│
├── docs/                       # Documentation
│   └── assets/                 # Images and screenshots
│
├── docker-compose.yml          # Docker configuration
├── .gitignore
├── README.md                   # This file
└── LICENSE
```

---

## 🔑 Key Features Explained

### Real-Time Threat Detection
The system continuously monitors network traffic and analyzes packets using machine learning algorithms to identify potential security threats.

### Dashboard
The main dashboard provides:
- Live network statistics
- Threat severity indicators
- Top threats and attack vectors
- Network performance metrics
- Historical trends

### Alert Management
- Customizable alert rules
- Multi-channel notifications (Email, SMS, Webhooks)
- Alert prioritization and filtering
- Incident response workflows

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration

### Threats
- `GET /api/threats` - Get all threats
- `GET /api/threats/:id` - Get threat details
- `GET /api/threats/stats` - Get threat statistics

### Network
- `GET /api/network/status` - Network status
- `GET /api/network/packets` - Recent packets

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database Connection Error**
- Verify database credentials in `.env`
- Ensure database service is running
- Check network connectivity

---

## 📖 Documentation

For detailed documentation, see:
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Lalit Singh**
- GitHub: [@lalitsingh789](https://github.com/lalitsingh789)
- Email: lalit@example.com

---

## 🙏 Acknowledgments

- React and Vite communities
- Contributors and maintainers
- Security research community

---

## 📞 Support

For issues and questions:
- Open an [GitHub Issue](https://github.com/lalitsingh789/IDS-/issues)
- Contact: lalit@example.com

---

<div align="center">

Made with ❤️ by [Lalit Singh](https://github.com/lalitsingh789)

⭐ If you find this helpful, please consider giving it a star!

</div>
