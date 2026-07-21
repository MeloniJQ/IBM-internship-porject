# 💰 BudgetHub - Multi-User Personal Finance & Business Expense Management Platform

A modern full-stack web application built with Flask that helps individuals, freelancers, startups, and businesses manage finances through secure authentication, transaction tracking, business-specific categorization, and interactive analytics.

BudgetHub enables users to monitor credited and debited transactions, visualize financial trends, and gain valuable insights into their spending habits using dynamic dashboards and reports.

---

## 🚀 Features

### 🔐 Authentication & Security

- Secure User Registration and Login
- Password Hashing using Werkzeug
- Session Management with Flask-Login
- Protected Routes
- User-Specific Data Isolation
- Email and Username Validation

### 💳 Transaction Management

- Add Transactions
- Edit Transactions
- Delete Transactions
- View Transaction History
- Recurring Transaction Support
- Advanced Filtering and Search

### 📊 Dashboard

- Monthly Credited Summary
- Monthly Debited Summary
- Balance Overview
- Recent Transactions Feed
- Real-Time Statistics

### 📈 Analytics

- Category-wise Spending Analysis
- Income vs Expense Comparison
- Monthly Financial Trends
- Top Transactions Report
- Financial Performance Insights

### 🏢 Business Type Support

Users can choose from:

- Personal Finance
- Freelancer
- Retail Store
- Restaurant / Cafe
- Service Business
- E-Commerce
- Startup

Each business type automatically receives customized financial categories.

### 🎨 User Experience

- Responsive Design
- Dark Mode Support
- Interactive Charts
- Modern UI Components
- Smooth Animations
- Accessibility Support

### 📤 Data Management

- CSV Export
- Custom Categories
- User Profile Management
- Persistent SQLite Storage

---

## 🎯 Project Objectives

The primary objective of BudgetHub is to provide a centralized platform for individuals and businesses to manage financial activities efficiently.

### Goals

- Track financial transactions accurately
- Generate meaningful financial insights
- Support multiple business domains
- Provide secure multi-user access
- Improve budgeting and spending awareness
- Deliver an intuitive user experience

---

## 🛠 Tech Stack

### Backend

| Technology             | Purpose                   |
| ---------------------- | ------------------------- |
| Python 3.14            | Core Programming Language |
| Flask 2.3.3            | Web Framework             |
| Flask-Login 0.6.2      | Authentication            |
| Flask-SQLAlchemy 3.1.1 | ORM Integration           |
| SQLAlchemy 2.0+        | Database Operations       |
| SQLite                 | Database                  |
| Werkzeug 2.3.7         | Password Hashing          |
| python-dotenv          | Environment Variables     |
| requests               | HTTP client for the AI Assistant's OpenRouter/Gemini calls |

### Frontend

| Technology      | Purpose            |
| --------------- | ------------------ |
| HTML5           | Structure          |
| CSS3            | Styling            |
| Bootstrap 5.3   | Responsive Design  |
| JavaScript ES6+ | Client-Side Logic  |
| Chart.js 4.4    | Data Visualization |
| Font Awesome    | Icons              |

---

## 🏗 System Architecture

```text
Frontend (HTML, CSS, JS)
          │
          ▼
     Flask Routes
          │
          ▼
   Business Logic Layer
          │
          ▼
    SQLAlchemy ORM
          │
          ▼
      SQLite DB
```

---

## 🔄 Application Workflow

1. User registers and selects a business type.
2. Default categories are generated automatically.
3. User logs into the system.
4. Transactions are created, updated, viewed, or deleted.
5. Data is stored securely in SQLite.
6. Dashboard and analytics pages fetch user-specific data.
7. Charts and reports are generated dynamically.
8. Users can export financial data as CSV files.

---

## 🌍 Business Categories

### Personal Finance

**Credited**

- Salary
- Freelance
- Investment
- Bonus
- Refund
- Gift

**Debited**

- Food
- Transport
- Rent
- Entertainment
- Utilities
- Healthcare
- Shopping
- Bills
- Subscriptions

### Freelancer

**Credited**

- Project Income
- Consulting
- Retainer
- Bonus
- Refund

**Debited**

- Software Tools
- Equipment
- Taxes
- Insurance
- Office Supplies
- Internet

### Startup

**Credited**

- Funding
- Revenue
- Investment
- Grants

**Debited**

- Salaries
- Development
- Marketing
- Infrastructure
- Legal
- Tools

Additional categories are generated automatically based on the selected business type.

---

## 📊 Database Schema

### Users

```sql
id
username
email
password_hash
full_name
business_type
created_at
```

### Categories

```sql
id
user_id
name
type
color
created_at
```

### Transactions

```sql
id
user_id
amount
category
type
date
description
is_recurring
created_at
updated_at
```

---

## 📁 Project Structure

```text
BudgetHub/
│
├── app.py
├── models.py
├── llm.py                # AI Assistant adapter (OpenRouter/Gemini)
├── requirements.txt
├── .env                  # your local secrets (gitignored, not committed)
├── .env.example           # template — copy to .env and fill in
│
├── templates/
│   ├── base.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── transactions.html
│   ├── analytics.html
│   └── settings.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── common.js
│       ├── dashboard.js
│       ├── transactions.js
│       ├── analytics.js
│       └── settings.js
│
└── budget_tracker.db
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.14+
- pip

### Clone Repository

```bash
git clone <repository-url>
cd BudgetHub
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Then edit `.env` and add your OpenRouter API key — required for the AI Budget Assistant feature to work. See [AI Budget Assistant](#-ai-budget-assistant-gemini-via-openrouter) below for details.

### Run Application

```bash
python app.py
```

### Open Browser

```text
http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication

```http
POST /register
POST /login
GET  /logout
```

### Transactions

```http
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/<id>
PUT    /api/transactions/<id>
DELETE /api/transactions/<id>
```

### Categories

```http
GET    /api/categories
POST   /api/categories
PUT    /api/categories/<id>
DELETE /api/categories/<id>
```

### Reports

```http
GET /api/summary
GET /api/monthly-stats
GET /api/analytics
```

### User

```http
GET /api/user
PUT /api/user
```

### Export

```http
GET /api/export-csv
```

### AI Assistant

```http
POST /api/gemini        # requires logged-in session
POST /api/gemini_key    # server-to-server, requires X-API-KEY header if GEMINI_SERVER_KEY is set
```

---

## 🧠 AI Budget Assistant (Gemini via OpenRouter)

The dashboard's **"Ask Assistant"** modal lets a logged-in user ask natural-language questions about their own finances (e.g. *"what is my profit for June 2026?"*). Behind the scenes:

1. The browser (`static/js/dashboard.js`) POSTs `{ "prompt": "..." }` to `POST /api/gemini`.
2. The Flask route (`app.py`, `api_gemini`) pulls the current user's transactions, groups them by month with SQLAlchemy (`_build_financial_context`), and builds a monthly income/expense/profit summary.
3. That summary is prepended to the user's question and sent to `llm.ask_gemini()`, which POSTs to an OpenRouter chat-completions endpoint and returns the model's reply.
4. The reply is returned as `{ "response": "..." }` and rendered in the modal.

Because the real transaction data is injected into the prompt, the assistant answers from the user's actual numbers instead of guessing — and it's told explicitly to say so if a requested period isn't in the data.

### Setup

1. Copy the example env file and fill in your own key:

   ```bash
   cp .env.example .env
   ```

2. Get a free API key from [openrouter.ai/keys](https://openrouter.ai/keys) and set it as both `OPENROUTER_API_KEY` and `GEMINI_API_KEY` in `.env` (the code accepts either name).

3. `.env` variables:

   | Variable             | Required | Description                                                                                                   |
   | -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
   | `GEMINI_API_URL`      | Yes      | `https://openrouter.ai/api/v1/chat/completions` — OpenRouter's chat-completions endpoint (routes to Gemini/Gemma/other models). |
   | `OPENROUTER_API_KEY` / `GEMINI_API_KEY` | Yes (one of these) | Your OpenRouter API key. |
   | `OPENROUTER_MODEL`    | No       | Model slug to use, e.g. `google/gemma-4-26b-a4b-it:free`. See [openrouter.ai/models](https://openrouter.ai/models). |
   | `GEMINI_SERVER_KEY`   | No       | Protects the service-to-service `/api/gemini_key` endpoint (see below). Leave blank for local testing.       |

   > ⚠️ **Free vs. paid models**: The default model, `google/gemma-4-26b-a4b-it:free`, works with **zero OpenRouter credits**. Real Gemini models (e.g. `google/gemini-2.5-flash`) require credits in your OpenRouter account (see [openrouter.ai/settings/credits](https://openrouter.ai/settings/credits)) — without them you'll get a `402 Payment Required` error. Set `OPENROUTER_MODEL` to switch once you've added credits.

4. `python-dotenv` loads `.env` automatically at app startup (`load_dotenv()` in `app.py`) — no manual `export` needed.

### Using it

- **From the UI**: log in, click "Ask Assistant" on the dashboard, type a question, and submit.
- **From Python**: `llm.ask_gemini(prompt, model=None, max_tokens=512)`.
- **Server-to-server**: `POST /api/gemini_key` with header `X-API-KEY: <GEMINI_SERVER_KEY>` — useful for calling the assistant from a script or CI without a browser session. If `GEMINI_SERVER_KEY` isn't set, the endpoint allows unauthenticated requests and adds a `_note` warning to the response, for easy local testing.

### Notes

- The response parser (`llm._extract_text_from_response`) is tolerant of different provider response shapes (OpenAI/OpenRouter `choices[].message.content`, Gemini-native `candidates[]`, etc.).
- For production use with Google Vertex/Cloud directly, prefer authenticated service accounts and the official SDKs — this adapter is built for quick demos and local development.

## 🔒 Security Features

- Password Hashing
- Session-Based Authentication
- User Data Isolation
- ORM-Based SQL Injection Protection
- Server-Side Input Validation
- Protected Routes
- Unique Email Validation

---

## ⭐ Key Highlights

- Multi-User Architecture
- Business-Type Based Categories
- Interactive Analytics Dashboard
- CSV Export Support
- Dark Mode Implementation
- Responsive User Interface
- RESTful API Design
- Secure Authentication System

---

## 🚀 Future Enhancements

- AI-Based Spending Prediction
- Budget Recommendation System
- OCR Receipt Scanning
- Voice Transaction Entry
- Google OAuth Login
- Email Notifications
- Mobile Application
- Cloud Database Integration
- Budget Goal Tracking
- Automated Recurring Transactions

---

## 🎓 Learning Outcomes

This project demonstrates:

- Flask Web Development
- Authentication Systems
- SQLAlchemy ORM
- Database Design
- REST API Development
- Responsive Web Design
- Data Visualization
- Session Management
- Frontend and Backend Integration

---

## 👩‍💻 Author

**Meloni Jonita**

Bachelor of Engineering – Computer Science

### Technologies Used

- Python
- Flask
- SQLAlchemy
- SQLite
- Bootstrap
- JavaScript
- Chart.js

---

## 📄 License

This project is developed for educational and learning purposes.

---

## 🌟 Acknowledgements

Special thanks to the open-source communities behind Flask, SQLAlchemy, Bootstrap, Chart.js, and other tools that made this project possible.

---

### 💰 BudgetHub – Track Smart. Spend Smarter.

Below are a few screen shots attached
<img width="1888" height="847" alt="Screenshot 2026-06-30 092025" src="https://github.com/user-attachments/assets/7496432b-7ae7-4d6b-940a-2a96cdb092ff" />
<img width="1897" height="857" alt="Screenshot 2026-06-30 092045" src="https://github.com/user-attachments/assets/c53a6ef5-61a7-4f5b-bf3d-297bbe002a1e" />

<img width="1911" height="855" alt="image" src="https://github.com/user-attachments/assets/b4d38486-5b57-4dac-9afc-0c4c86a607c8" />

<img width="1896" height="863" alt="Screenshot 2026-06-27 223032" src="https://github.com/user-attachments/assets/ef021f06-88e4-48f3-9adf-5b6713ff262b" />

<img width="1908" height="868" alt="image" src="https://github.com/user-attachments/assets/da6e0603-60c4-4767-8413-fd50b10df953" />

<img width="1886" height="863" alt="image" src="https://github.com/user-attachments/assets/d80b9486-0ab9-429e-98a6-e942bf4bf622" />

<img width="1067" height="785" alt="image" src="https://github.com/user-attachments/assets/d9fcf3a4-d41a-4a60-971e-3df1937b2c83" />
<img width="922" height="772" alt="image" src="https://github.com/user-attachments/assets/689cb6db-7352-4f59-81c8-e0bd4bd04083" />
<img width="930" height="768" alt="image" src="https://github.com/user-attachments/assets/b03d6d96-b4c5-4c03-90d9-aa6a2970718b" />

<br><br>

Below is the link for the screen recording of my project
https://www.loom.com/share/9aa3f4a11843444aa7ca475c531bd951
