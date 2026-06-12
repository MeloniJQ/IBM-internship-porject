# 💰 BudgetHub - Multi-User Personal Finance Tracker

A sophisticated, multi-page budget tracking application with user authentication, business-specific categories, and comprehensive financial analytics. Track your money with style!

---

## ✨ Key Features

### 🔐 User Authentication
- ✅ Secure registration with business type selection
- ✅ User login with session management
- ✅ Password hashing and encryption
- ✅ User-specific data isolation (no data mixing)
- ✅ Logout functionality

### 🏢 Business Type Categories
- ✅ **Personal Finance** - Standard income/expense tracking
- ✅ **Freelancer** - Project income, tools, professional development
- ✅ **Retail Store** - Inventory, staff, sales tracking
- ✅ **Restaurant/Cafe** - Food costs, beverages, customer service
- ✅ **Service Business** - Salaries, office, equipment
- ✅ **E-Commerce** - Product sales, shipping, platform fees
- ✅ **Startup** - Funding, development, infrastructure

### 💼 Multi-Page Dashboard
- **Dashboard Page** - Overview with graphs, monthly summary, net balance
- **Transactions Page** - Full CRUD operations with filtering and sorting
- **Analytics Page** - Detailed reports, category breakdown, top transactions
- **Settings Page** - Profile management, custom categories, preferences

### 📊 Complete CRUD Operations
- ✅ Add income/expense with category, date, description
- ✅ Edit existing transactions anytime
- ✅ Delete unwanted entries
- ✅ Change terminology: **Credited** (Income) & **Debited** (Expense)

### 📈 Visual Dashboard
- ✅ Monthly summary cards (Credited, Debited, Balance)
- ✅ Doughnut chart for category-wise spending breakdown
- ✅ 12-month bar chart showing trends
- ✅ Real-time data updates
- ✅ Responsive grid layout

### 🎨 Beautiful UI/UX
- ✅ Vibrant gradient colors and animations
- ✅ Dark mode with persistent storage
- ✅ Smooth transitions and hover effects
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Modern card-based interface

### 🔧 Advanced Functionality
- ✅ Filter transactions by month, type, category
- ✅ Search and sort features
- ✅ Export data as CSV
- ✅ Custom category creation
- ✅ Recurring transaction marking
- ✅ Data persistence (SQLite)

---

## 🛠 Tech Stack

### Backend
- **Framework**: Flask 2.3.3
- **Authentication**: Flask-Login 0.6.2
- **Database**: SQLite with SQLAlchemy ORM
- **Security**: Werkzeug password hashing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, gradients, animations
- **JavaScript**: ES6+ with async/await
- **Framework**: Bootstrap 5.3
- **Charts**: Chart.js 4.4
- **Icons**: Font Awesome 6.4

### Database Schema
```
Users Table
├── id (Primary Key)
├── username (Unique)
├── email (Unique)
├── password_hash
├── full_name
├── business_type
└── timestamps

Categories Table
├── id (Primary Key)
├── user_id (Foreign Key)
├── name
├── type (credited/debited)
├── color
└── timestamps

Transactions Table
├── id (Primary Key)
├── user_id (Foreign Key)
├── amount
├── category
├── type (credited/debited)
├── date
├── description
├── is_recurring
└── timestamps
```

---

## 📋 Mandatory Features ✅

### 1. CRUD Operations
- Users can **add** income/expense entries
- Users can **edit** existing entries
- Users can **delete** entries
- Each entry has: amount, category, date, type (credited/debited)

### 2. Dashboard with Charts
- Monthly summary cards
- Doughnut chart for category breakdown
- Bar chart for 12-month trends
- Real-time data display

### 3. Data Persistence
- **SQLite Database** - Reliable local storage
- **User-specific data** - No data mixing between users
- **Data retrieval** - Previous data available after login
- **Automatic backups** - Database maintains integrity

### 4. Responsive Design
- ✅ Mobile devices (< 576px)
- ✅ Tablets (576px - 768px)
- ✅ Desktops (> 1024px)
- ✅ All features accessible on all devices
- ✅ Touch-friendly buttons and inputs

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip package manager
- Modern web browser

### Installation

```bash
# 1. Clone or download the project
cd budget-tracker

# 2. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the application
python app.py

# 5. Open in browser
# Visit: http://localhost:5000
```

---

## 📖 Usage Guide

### First Time Setup

1. **Register Account**
   - Click "Create Account"
   - Select your business type
   - This auto-generates relevant categories
   - Fill in details and submit

2. **Login**
   - Enter username and password
   - Your personalized dashboard appears

3. **View Dashboard**
   - See monthly overview
   - Check graphs and statistics
   - Review recent transactions

### Adding Transactions

1. Go to **Transactions** page
2. Click "Add Transaction" button
3. Fill in:
   - Amount (₹)
   - Type (Credited/Debited)
   - Category (auto-filled based on type)
   - Date
   - Description (optional)
   - Recurring checkbox
4. Click "Add Transaction"

### Managing Transactions

**View All**: Go to Transactions page to see all entries

**Filter**: 
- By month
- By type (Credited/Debited)
- By category

**Edit**: Click edit icon, change details, save

**Delete**: Click delete icon, confirm

### Viewing Analytics

Go to **Analytics** page to see:
- Category-wise breakdown
- Spending distribution
- Income vs Expense comparison
- Top 10 transactions
- Percentage calculations

### Managing Settings

Go to **Settings** page to:
- Update profile (full name, email)
- Create custom categories
- Change theme (Light/Dark/Auto)
- Change password
- Export data
- Delete data (with confirmation)

---

## 🌍 Business Type Categories

### Personal Finance
**Credited**: Salary, Freelance, Investment, Bonus, Refund, Gift
**Debited**: Food, Transport, Rent, Entertainment, Utilities, Healthcare, Shopping, Bills, Subscriptions, Personal Care

### Freelancer
**Credited**: Project Income, Consulting, Retainer, Bonus, Refund
**Debited**: Office Supplies, Software Tools, Internet, Phone, Transportation, Food, Equipment, Professional Development, Taxes, Insurance

### Retail Store
**Credited**: Sales, Returns Received, Discounts Given, Other Income
**Debited**: Inventory, Staff Salary, Rent, Utilities, Marketing, Equipment, Maintenance, Shipping, Packaging, Licenses

### Restaurant/Cafe
**Credited**: Food Sales, Beverage Sales, Catering, Delivery, Other Revenue
**Debited**: Food Cost, Beverages, Staff Salary, Rent, Utilities, Equipment, Maintenance, Licenses, Marketing, Waste

### Service Business
**Credited**: Service Revenue, Consultation, Subscription, Retainer, Other Income
**Debited**: Staff Salary, Office Rent, Utilities, Insurance, Equipment, Marketing, Software, Travel, Training, Supplies

### E-Commerce
**Credited**: Product Sales, Digital Sales, Advertising Revenue, Affiliate Income, Other Revenue
**Debited**: Product Cost, Shipping, Platform Fees, Marketing, Server Cost, Payment Processing, Packaging, Customer Service, Returns, Inventory

### Startup
**Credited**: Funding, Revenue, Investment, Grants, Other Income
**Debited**: Salaries, Office, Development, Marketing, Equipment, Legal, Insurance, Infrastructure, Tools, Miscellaneous

---

## 📱 Page Structure

### Public Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New account creation

### Protected Pages (Login Required)
- **Dashboard** (`/dashboard`) - Overview and quick stats
- **Transactions** (`/transactions`) - Full transaction management
- **Analytics** (`/analytics`) - Detailed reports
- **Settings** (`/settings`) - User preferences and settings

### API Endpoints
```
Authentication:
GET/POST /login
GET/POST /register
GET /logout

Transactions:
GET /api/transactions (with filters)
POST /api/transactions (create)
GET /api/transactions/<id> (view)
PUT /api/transactions/<id> (update)
DELETE /api/transactions/<id> (delete)

Summary & Reports:
GET /api/summary?month=YYYY-MM
GET /api/monthly-stats
GET /api/analytics

Categories:
GET /api/categories
POST /api/categories (create custom)
PUT /api/categories/<id> (update)
DELETE /api/categories/<id> (delete)

Data:
GET /api/user
PUT /api/user (update profile)
GET /api/export-csv (download)
```

---

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Credited**: Green (#28a745)
- **Debited**: Red (#dc3545)
- **Accents**: Gold, Blue, Gray

### Animations
- Smooth card hover effects
- Slide-in alerts
- Button press effects
- Loading spinners
- Fade transitions

### Dark Mode
- Automatic detection
- Persistent storage
- Smooth transitions
- All elements themed

---

## 🔒 Security Features

✅ Password hashing with Werkzeug
✅ User session management
✅ Database-level user isolation
✅ SQL injection prevention (SQLAlchemy ORM)
✅ CSRF protection ready
✅ Secure password validation
✅ Email uniqueness validation
✅ Input validation on server

---

## 📊 Data Examples

### Sample Transaction
```json
{
  "id": 1,
  "amount": 500.00,
  "category": "Food",
  "type": "debited",
  "date": "2024-01-15",
  "description": "Grocery shopping",
  "is_recurring": false,
  "created_at": "2024-01-15T10:30:00"
}
```

### Sample Summary
```json
{
  "month": "2024-01",
  "total_credited": 50000.00,
  "total_debited": 20000.00,
  "balance": 30000.00,
  "category_breakdown": {
    "Food": 5000.00,
    "Transport": 3000.00,
    "Rent": 12000.00
  }
}
```

---

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
# Use different port
# Edit app.py last line:
app.run(debug=True, port=5001)
```

### Database Issues
```bash
# Reset database (will lose data!)
rm budget_tracker.db
# Restart app - new database created
python app.py
```

### Module Not Found
```bash
# Ensure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Reinstall packages
pip install -r requirements.txt
```

### Login Problems
- Clear browser cookies
- Try incognito/private mode
- Check username/password spelling

---

## 📚 File Structure

```
budget-tracker/
├── app.py                    # Main Flask application
├── models.py                 # Database models
├── requirements.txt          # Python dependencies
│
├── templates/
│   ├── base.html            # Base template
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── dashboard.html       # Dashboard page
│   ├── transactions.html    # Transactions page
│   ├── analytics.html       # Analytics page
│   ├── settings.html        # Settings page
│   ├── 404.html             # Error page
│   ├── 403.html             # Forbidden page
│   └── 500.html             # Server error page
│
├── static/
│   ├── css/
│   │   └── style.css        # Vibrant styling
│   └── js/
│       ├── common.js        # Shared utilities
│       ├── dashboard.js     # Dashboard logic
│       ├── transactions.js  # Transactions logic
│       ├── analytics.js     # Analytics logic
│       └── settings.js      # Settings logic
│
└── budget_tracker.db        # SQLite database (auto-created)
```

---

## 🎓 Learning Outcomes

By using this app, you'll learn:
- Flask application architecture
- SQLAlchemy ORM usage
- User authentication systems
- Responsive web design
- Chart.js integration
- JavaScript fetch API
- Bootstrap framework
- Database design
- RESTful API concepts
- Session management

---

## 🚀 Future Enhancements

- Email notifications
- Budget goals/targets
- Recurring transaction automation
- Mobile app (React Native)
- Cloud backup
- Multi-currency support
- Bank account integration
- Tax report generation
- PDF export
- API documentation portal

---

## 📞 Support

If you encounter issues:
1. Check the browser console (F12)
2. Check terminal for error messages
3. Review the README.md file
4. Check DEVELOPER_GUIDE.md for code details
5. Check FAQ.md for common questions

---

## 📄 License

This project is open source and available for personal and educational use.

---

## 👨‍💻 Developer Notes

### To Extend Features

1. **Add new category**: Edit `BUSINESS_CATEGORIES` in `app.py`
2. **Add new page**: Create HTML template and Flask route
3. **Modify styling**: Edit `static/css/style.css`
4. **Add API endpoint**: Create route in `app.py`
5. **Update database**: Modify `models.py` and recreate DB

### Code Quality
- All functions documented
- Consistent naming conventions
- Error handling implemented
- Responsive design throughout
- Accessible markup and labels

---

**Created with ❤️ for financial freedom and smart money management!**

Last Updated: June2026
Status: Production Ready ✅
