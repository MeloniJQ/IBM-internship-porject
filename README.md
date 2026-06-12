💰 BudgetHub – Multi-User Personal Finance & Business Expense Management Platform

A modern full-stack web application that helps individuals, freelancers, startups, and businesses track income, expenses, and financial activities through an interactive dashboard, analytics engine, and secure user authentication system.

BudgetHub provides business-specific financial categorization, real-time insights, data visualization, and comprehensive transaction management while maintaining complete data isolation for every user.

🚀 Live Features
    🔐 Authentication & Security
      User Registration & Login
      Secure Password Hashing
      Session Management using Flask-Login
      Protected Routes
      User-Specific Data Isolation
      Email & Username Validation
    💳 Transaction Management
      Add Transactions
      Edit Transactions
      Delete Transactions
      View Transaction History
      Recurring Transaction Support
      Transaction Search & Filtering
    📊 Dashboard
      Monthly Credited Summary
      Monthly Debited Summary
      Current Balance Overview
      Recent Transaction Feed
      Dynamic Financial Statistics
    📈 Analytics
      Category-wise Spending Breakdown
      Income vs Expense Analysis
      Monthly Trend Analysis
      Top Transactions Report
      Financial Performance Insights

    🏢 Business Type Support
      Users can choose from:
        Personal Finance
        Freelancer
        Retail Store
        Restaurant / Cafe
        Service Business
        E-Commerce
        Startup
      Each business type automatically receives customized financial categories.
    🎨 User Experience
      Responsive Design
      Dark Mode Support
      Mobile Friendly Layout
      Interactive Charts
      Modern UI Components
      Smooth Animations
      Accessibility Support
    📤 Data Management
      CSV Export
      Custom Categories
      User Profile Management
      Persistent Database Storage

🎯 Project Objectives
The primary goal of BudgetHub is to provide an easy-to-use financial management solution for both individuals and small businesses.
Objectives include:
  Recording financial transactions efficiently
  Managing income and expenses systematically
  Generating meaningful financial insights
  Supporting multiple business domains
  Providing secure multi-user access
  Improving budgeting and spending awareness

🛠 Technology Stack
  Backend
    Technology	Purpose
    Python 3.14	Core Programming Language
    Flask 2.3.3	Web Framework
    Flask-Login 0.6.2	Authentication
    Flask-SQLAlchemy 3.1.1	ORM Integration
    SQLAlchemy 2.0+	Database Operations
    SQLite	Database
    Werkzeug 2.3.7	Security & Password Hashing
    python-dotenv	Environment Management
  Frontend
    Technology	Purpose
    HTML5	Structure
    CSS3	Styling
    Bootstrap 5.3	Responsive Design
    JavaScript ES6+	Frontend Logic
    Chart.js 4.4	Data Visualization
    Font Awesome	Icons


🏗 System Architecture
┌───────────────────────┐
│       Frontend        │
│ HTML • CSS • JS       │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│      Flask Routes     │
│ Authentication Layer  │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│    Business Logic     │
│ Validation & APIs     │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│     SQLAlchemy ORM    │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│    SQLite Database    │
└───────────────────────┘


🔄 Application Workflow
    User Registration
            ↓
    Business Type Selection
            ↓
    Automatic Category Generation
            ↓
    User Login
            ↓
    Dashboard Access
            ↓
    Transaction CRUD Operations
            ↓
    Analytics & Reporting
            ↓
    Data Export


📊 Database Schema (created when the aplication runs)
  Users Table
    Users
    ├── id
    ├── username
    ├── email
    ├── password_hash
    ├── full_name
    ├── business_type
    └── created_at
  Categories Table
    Categories
    ├── id
    ├── user_id
    ├── name
    ├── type
    ├── color
    └── created_at
  Transactions Table
    Transactions
    ├── id
    ├── user_id
    ├── amount
    ├── category
    ├── type
    ├── date
    ├── description
    ├── is_recurring
    └── timestamps


📁 Project Structure
BudgetHub/
│
├── app.py
├── models.py
├── requirements.txt
├── templates/
│   ├── base.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── transactions.html
│   ├── analytics.html
│   └── settings.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── common.js
│       ├── dashboard.js
│       ├── transactions.js
│       ├── analytics.js
│       └── settings.js
└── budget_tracker.db


⚙️ Installation & Setup
  Prerequisites
  Python 3.14+
  pip
  Git (optional)

Clone Repository
git clone https://github.com/MeloniJQ/azentrix-fullstack-task1.git
cd azentrix-fullstack-task1

Create Virtual Environment
  python -m venv venv
  Activate Environment:
    Windows
      venv\Scripts\activate
    Linux / macOS
      source venv/bin/activate

Install Dependencies
  pip install -r requirements.txt

Run Application
  python app.py
Open Browser
  http://localhost:5000
📡 API Endpoints
  Authentication
    POST /register
    POST /login
    GET  /logout
  Transactions
    GET    /api/transactions
    POST   /api/transactions
    GET    /api/transactions/<id>
    PUT    /api/transactions/<id>
    DELETE /api/transactions/<id>
  Categories
    GET    /api/categories
    POST   /api/categories
    PUT    /api/categories/<id>
    DELETE /api/categories/<id>
  Reports
    GET /api/summary
    GET /api/monthly-stats
    GET /api/analytics
  User
    GET /api/user
    PUT /api/user
  Export
    GET /api/export-csv

🔒 Security Features
  Password Hashing using Werkzeug
  Session-Based Authentication
  User Data Isolation
  SQL Injection Prevention through ORM
  Input Validation
  Unique Email Validation
  Protected Routes

📈 Key Technical Implementations
  Authentication System
  Flask-Login Integration
  Login Required Routes
  Secure Session Management
  Analytics Engine
  Monthly Financial Calculations
  Category Analysis
  Balance Tracking
  Spending Trends
  Database Layer
  SQLAlchemy ORM
  Relational Database Design
  One-to-Many Relationships
  Frontend Features
  AJAX API Communication
  Dynamic Dashboard Updates
  Interactive Charts
  Theme Persistence


⭐ Why BudgetHub Stands Out
Unlike traditional budget tracking systems, BudgetHub provides:
  Multi-user Architecture
  Business-specific Financial Categories
  Secure User Isolation
  Analytics Dashboard
  CSV Export Functionality
  Dark Mode Support
  Fully Responsive UI
  Modern REST API Design

🚀 Future Enhancements
  AI-Based Spending Prediction
  Financial Recommendation System
  OCR Receipt Scanning
  Voice Transaction Entry
  Google OAuth Login
  Email Notifications
  Mobile Application
  Cloud Database Support
  Budget Goal Tracking
  Automated Recurring Transactions

🎓 Learning Outcomes
This project demonstrates:
  Flask Application Development
  Authentication Systems
  Database Design
  SQLAlchemy ORM
  REST API Development
  Responsive Web Design
  Data Visualization
  Session Management
  Frontend-Backend Integration

👩‍💻 Author
Meloni Jonita
Bachelor of Engineering – Computer Science

Built Using
  Python
  Flask
  SQLAlchemy
  SQLite
  Bootstrap
  JavaScript
  Chart.js

📄 License

This project is developed for educational and learning purposes.

🌟 Acknowledgements

Special thanks to the open-source community and the developers behind:

Flask
SQLAlchemy
Bootstrap
Chart.js