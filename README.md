# 💰 Personal Budget Tracker Web App

A simple, responsive, and beginner-friendly budget tracking application built with Python Flask, SQLite, and modern web technologies. Track your income and expenses effortlessly with an intuitive dashboard, visual charts, and powerful filtering.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features ✅
- **CRUD Operations**: Add, Edit, and Delete income/expense entries
- **Dashboard Summary**: View monthly income, expenses, and balance at a glance
- **Visual Charts**: 
  - Pie/Doughnut chart for expense breakdown by category
  - Bar chart for 12-month income vs expense comparison
- **Category Management**: Organize transactions by predefined or custom categories
- **Data Persistence**: SQLite database for reliable data storage
- **Responsive Design**: Mobile, tablet, and desktop friendly interface
- **Dark Mode**: Toggle between light and dark themes

### Advanced Features ✨
- **Search & Filter**: Filter by month, category, or transaction type
- **Export CSV**: Download all transactions as a CSV file for analysis
- **Recurring Entries**: Mark transactions as recurring for future reference
- **Overspend Alerts**: Get notified when category expenses exceed threshold
- **Date Range Filtering**: Custom date range selection for deep analysis
- **Auto-refresh**: Dashboard updates every 5 seconds
- **Accessibility**: ARIA labels and keyboard navigation support
- **Animations**: Smooth transitions and loading states

---

## 🛠 Tech Stack

### Backend
- **Framework**: Flask 2.3.3 (Python web framework)
- **Database**: SQLite 3 (lightweight, file-based)
- **ORM**: SQLAlchemy 2.0.21 (database abstraction)
- **Python Version**: 3.8+

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom styling with CSS variables for theming
- **JavaScript (ES6+)**: Modern JavaScript with async/await
- **Bootstrap 5.3**: Responsive grid and components
- **Chart.js 4.4**: Interactive data visualization
- **Font Awesome 6.4**: Icon library

### Additional Libraries
- **python-dotenv**: Environment variable management
- **Werkzeug**: WSGI utilities for Flask

---

## 📁 Project Structure

```
budget-tracker/
│
├── app.py                      # Main Flask application
├── models.py                   # SQLAlchemy database models
├── requirements.txt            # Python dependencies
├── budget_tracker.db          # SQLite database (auto-created)
├── README.md                  # This file
│
├── templates/
│   └── index.html             # Main HTML template
│
├── static/
│   ├── css/
│   │   └── style.css          # Custom CSS with dark mode
│   └── js/
│       └── script.js          # Frontend logic and API calls
│
└── .gitignore                 # Git ignore file
```

---

## 🚀 Installation & Setup

### Prerequisites

Make sure you have the following installed:
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **pip** - Usually comes with Python
- **Git** (optional) - For version control

### Step-by-Step Installation

#### 1. Clone or Download the Project

```bash
# Clone the repository (if using git)
git clone https://github.com/yourusername/budget-tracker.git
cd budget-tracker

# Or simply download and extract the ZIP file
```

#### 2. Create a Virtual Environment (Recommended)

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask 2.3.3
- Flask-SQLAlchemy 3.0.5
- SQLAlchemy 2.0.21
- Werkzeug 2.3.7
- python-dotenv 1.0.0

#### 4. Run the Application

```bash
python app.py
```

The app will start on `http://localhost:5000`

#### 5. Open in Browser

Navigate to `http://localhost:5000` in your web browser.

### Database Setup

The SQLite database is automatically created on first run. No manual setup needed!

```
budget_tracker.db  ← Auto-created after first app.py run
```

---

## 📖 Usage Guide

### Adding a Transaction

1. Fill in the form on the right sidebar:
   - **Amount**: Enter the transaction amount
   - **Type**: Select "Income" or "Expense"
   - **Category**: Choose from predefined categories
   - **Date**: Pick the transaction date
   - **Description**: Add optional notes
   - **Recurring**: Check if it repeats monthly

2. Click **"Add Transaction"** button
3. See the dashboard update in real-time

### Editing a Transaction

1. Click the **Edit** button (pencil icon) in the table
2. Modify the details in the modal
3. Click **"Save Changes"**

### Deleting a Transaction

1. Click the **Delete** button (trash icon) in the table
2. Confirm the deletion

### Filtering Transactions

Use the filter section to narrow down transactions:
- **Month**: Select a specific month
- **Type**: Filter by Income/Expense
- **Category**: Filter by specific category

Click **"Clear Filters"** to reset.

### Viewing Analytics

The dashboard displays:
- **Summary Cards**: Total income, expense, and balance
- **Category Chart**: Pie chart showing expense distribution
- **Monthly Chart**: 12-month income vs expense comparison

### Exporting Data

Click the **Export** button in the navbar to download transactions as CSV.

### Dark Mode

Click the **Theme Toggle** button (moon/sun icon) to switch themes.

### Alerts & Notifications

If expenses in any category exceed ₹5,000, you'll see an alert at the top.

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### Get All Transactions
```http
GET /api/transactions
```

**Query Parameters:**
- `category` (optional): Filter by category
- `type` (optional): Filter by type (income/expense)
- `month` (optional): Filter by month (YYYY-MM)
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": 1,
    "amount": 5000.00,
    "category": "Salary",
    "type": "income",
    "date": "2024-01-15",
    "description": "Monthly salary",
    "is_recurring": true,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

#### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
  "amount": 5000.00,
  "category": "Salary",
  "type": "income",
  "date": "2024-01-15",
  "description": "Monthly salary",
  "is_recurring": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "message": "Transaction added successfully"
}
```

#### Get Single Transaction
```http
GET /api/transactions/<id>
```

#### Update Transaction
```http
PUT /api/transactions/<id>
Content-Type: application/json

{
  "amount": 5500.00,
  "category": "Salary",
  "type": "income",
  "date": "2024-01-15",
  "description": "Updated salary",
  "is_recurring": true
}
```

#### Delete Transaction
```http
DELETE /api/transactions/<id>
```

**Response:** `200 OK`
```json
{
  "message": "Transaction deleted successfully"
}
```

#### Get Monthly Summary
```http
GET /api/summary?month=2024-01
```

**Response:**
```json
{
  "month": "2024-01",
  "total_income": 50000.00,
  "total_expense": 20000.00,
  "balance": 30000.00,
  "category_breakdown": {
    "Food": 5000.00,
    "Transport": 3000.00,
    "Rent": 12000.00
  },
  "all_categories_income": {
    "Salary": 50000.00
  },
  "all_categories_expense": {
    "Food": 5000.00,
    "Transport": 3000.00
  }
}
```

#### Get 12-Month Stats
```http
GET /api/monthly-stats
```

**Response:**
```json
[
  {
    "month": "January 2024",
    "income": 50000.00,
    "expense": 20000.00,
    "balance": 30000.00
  }
]
```

#### Get Categories
```http
GET /api/categories
```

**Response:**
```json
["Food", "Transport", "Rent", "Salary", "Freelance", ...]
```

#### Check Overspend
```http
GET /api/check-overspend?month=2024-01&threshold=5000
```

**Response:**
```json
[
  {
    "category": "Food",
    "amount": 6000.00,
    "threshold": 5000,
    "message": "Alert: Food expenses (₹6000.00) exceed limit"
  }
]
```

#### Export CSV
```http
GET /api/export-csv
```

**Response:** CSV file download

---

## 🗄 Database Schema

### Transactions Table

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount FLOAT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Other',
  type VARCHAR(20) NOT NULL,  -- 'income' or 'expense'
  date DATE NOT NULL,
  description VARCHAR(200),
  is_recurring BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Column Descriptions

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Unique identifier (auto-increment) |
| amount | FLOAT | Transaction amount (₹) |
| category | VARCHAR(50) | Category name |
| type | VARCHAR(20) | "income" or "expense" |
| date | DATE | Transaction date |
| description | VARCHAR(200) | Optional notes |
| is_recurring | BOOLEAN | Monthly recurring flag |
| created_at | DATETIME | Record creation timestamp |
| updated_at | DATETIME | Record update timestamp |

---

## ⚙️ Configuration

### Flask Configuration

Edit `app.py` to modify:

```python
# Database location
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget_tracker.db'

# Disable tracking modifications (improves performance)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Secret key for sessions (change this!)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
```

### Running in Production

To run the app in production mode:

```bash
# Install production WSGI server
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables (Optional)

Create a `.env` file:

```env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///budget_tracker.db
SECRET_KEY=your-secret-key-here
```

Load in `app.py`:

```python
from dotenv import load_dotenv
import os

load_dotenv()
```

---

## 🐛 Troubleshooting

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Use a different port
python app.py  # Then modify in app.py: app.run(port=5001)

# Or kill the process using port 5000
# On Windows: netstat -ano | findstr :5000
# On macOS/Linux: lsof -i :5000 | kill -9 <PID>
```

### Issue: Module Not Found Error

**Solution:**
```bash
# Make sure virtual environment is activated
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

# Then reinstall dependencies
pip install -r requirements.txt
```

### Issue: Database Locked Error

**Solution:**
1. Close all connections to the database
2. Delete `budget_tracker.db`
3. Restart the app to recreate the database

### Issue: Charts Not Loading

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. Check browser console for JavaScript errors (F12)

### Issue: Dark Mode Not Persisting

**Solution:**
1. Check if browser allows localStorage
2. Enable cookies/storage in browser settings
3. Try in incognito/private mode

---

## 🚀 Future Enhancements

### Planned Features
- [ ] User authentication & multi-user support
- [ ] Budget goals and targets
- [ ] Recurring transaction automation
- [ ] PDF reports generation
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Data backup & restore
- [ ] Advanced analytics & predictions
- [ ] Multi-currency support
- [ ] Bank account integration

### Contribution Ideas
- Add more payment method tracking
- Implement savings goals
- Create investment tracking
- Add tax report generation
- Build API documentation portal

---

## 📝 Code Organization & Best Practices

### Backend Architecture

**app.py** - Flask application with route handlers:
- Route organization by resource type
- Error handling with custom decorators
- JSON API responses
- Request validation

**models.py** - SQLAlchemy ORM models:
- Table definitions with proper constraints
- Relationship definitions
- Helper methods (to_dict, validate)
- Query optimizations

### Frontend Architecture

**HTML Structure**:
- Semantic HTML5 markup
- Accessible form elements
- ARIA labels for screen readers
- Proper heading hierarchy

**CSS Organization**:
- CSS variables for theming
- Mobile-first responsive design
- Utility classes for common styles
- Animation keyframes

**JavaScript Patterns**:
- State management object (appState)
- Separation of concerns (API calls, display, events)
- Error handling with try-catch
- Async/await for API calls

---

## 🔒 Security Considerations

> ⚠️ This is a local/personal use application. For production deployment:

1. **Change the SECRET_KEY** in `app.py`
2. **Enable HTTPS** if deployed online
3. **Add authentication** before public deployment
4. **Validate all inputs** on backend
5. **Use environment variables** for sensitive data
6. **Enable CORS** only for trusted domains
7. **Add rate limiting** to prevent abuse
8. **Use strong database passwords** if using remote DB
9. **Regular backups** of the database
10. **Keep dependencies updated** regularly

---

## 📱 Responsive Design

The app is fully responsive across devices:

- **Desktop (1024px+)**: Full layout with sidebar form
- **Tablet (768px-1023px)**: Stacked components
- **Mobile (< 768px)**: Single column layout

Test with browser DevTools (F12) → Toggle Device Toolbar

---

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliant (WCAG AA)
- Focus visible states
- Screen reader friendly
- Form validation messages

---

## 📊 Sample Data

### Default Categories

**Income:**
- Salary
- Freelance
- Investment
- Bonus

**Expense:**
- Food
- Transport
- Rent
- Entertainment
- Utilities
- Healthcare
- Shopping
- Other

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💬 Support & Feedback

- Report bugs via GitHub Issues
- Request features in Discussions
- Share your feedback and suggestions
- Join our community

---

## 📚 Additional Resources

### Learning Resources
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools & Services
- [Flask Extensions](https://flask.palletsprojects.com/extensions/)
- [Python Package Index](https://pypi.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [SQLite Browser](https://sqlitebrowser.org/)

---

## 🎉 Getting Started Quick Reference

```bash
# 1. Setup
git clone <repo-url> && cd budget-tracker
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# 2. Run
python app.py

# 3. Open browser
# Visit: http://localhost:5000

# 4. Start using!
# Add your first transaction and watch the magic happen ✨
```

---

**Made with ❤️ for budget enthusiasts everywhere**

For more information or questions, please open an issue on GitHub!

Happy budgeting! 💰
