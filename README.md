IDS Sentinel — Intrusion Detection System
IDS Sentinel is a web-based Intrusion Detection System that uses machine learning to analyze network traffic patterns, detect anomalies, and classify threats in real time. It provides an intuitive dashboard for monitoring, prediction, and analytics with a sleek dark-themed interface.

✨ Features
🔐 Authentication & Roles
User Registration — Sign up with full name, email, organization ID, area of research, and user type.
User Login — Secure email/password authentication for standard users.
Admin Login — Separate admin portal authenticated via admin email and access key for elevated privileges.
📊 Dashboard
Real-time system status with "Sentinel Network Secure Channel Active" indicator.
Dataset and model selection for traffic analysis.
Analytics configuration and model monitoring controls.
Reporting interface with export capabilities.
🔍 Threat Prediction
Input network traffic features (duration, volume, protocol, etc.) to classify traffic behavior.
Preset configurations for quick testing of different traffic scenarios.
Real-time prediction results displaying detected attack types.
📈 Analytics & Visualization
Classification Overview — Track counts for Safe, Medium, High, and Critical severity labels.
Donut Chart — Visual distribution of total predictions across all categories.
Bar Chart — Per-label breakdown for attack types including Benign, DDoS, Okiru, CSC, FastIDEAHorizontalPortScan, and more.
🧠 How It Works
Data Ingestion — Network traffic data is fed into the system via CSV upload or real-time capture.
Preprocessing — Features are extracted, normalized, and prepared for the ML pipeline.
Model Inference — A trained classification model predicts whether traffic is benign or identifies the specific attack type.
Visualization — Results are rendered through interactive charts and a searchable prediction interface.
🖥️ System Interfaces
Table
Module	Description
User Login Portal	Email + password authentication for standard users
Admin Login Portal	Admin email + access key authentication for administrators
Registration Portal	Self-service sign-up with organization and research details
Main Dashboard	System status, dataset/model selection, analytics controls
Prediction Interface	Feature input form with real-time classification results
Analytics View	Donut chart, bar chart, and severity distribution overview
🛠️ Tech Stack
Table
Layer	Technology
Frontend	HTML, CSS, JavaScript — Dark-themed UI
Backend	Python (Flask / Django)
Machine Learning	Scikit-learn, Pandas, NumPy
Visualization	Chart.js / Plotly
Database	SQLite / PostgreSQL
Authentication	Session-based with role separation (user vs. admin)
🚀 Getting Started
Prerequisites
Python 3.8+
pip
Git
Installation
bash
# Clone the repository
git clone https://github.com/lalitsingh789/IDS-.git
cd IDS-

# Create a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up the database
python manage.py migrate        # or flask db upgrade

# Seed sample data (optional)
python manage.py seed

# Run the application
python app.py                   # or python manage.py runserver
Access the Application
Table
Portal	Route	Description
User Login	/ or /login	Standard user authentication
Admin Login	/admin-login	Administrator authentication
Registration	/register	New user sign-up
Dashboard	/dashboard	System overview and controls
Prediction	/predict	Traffic classification interface
Analytics	/analytics	Charts and label distribution view
📁 Project Structure
perl
IDS-/  
├── app/  
│   ├── static/          # CSS, JS, images  
│   ├── templates/       # HTML templates  
│   ├── models/          # ML models and preprocessing pipelines  
│   ├── routes/          # Application routes (auth, dashboard, predict, analytics)  
│   ├── utils/           # Helper functions and utilities  
│   └── __init__.py  
├── data/                # Datasets and
