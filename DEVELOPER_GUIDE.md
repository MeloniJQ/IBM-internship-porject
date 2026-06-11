# 🔧 Developer Guide

A comprehensive guide to understanding, extending, and customizing the Budget Tracker application.

---

## Table of Contents

1. [Code Architecture](#code-architecture)
2. [Backend Development](#backend-development)
3. [Frontend Development](#frontend-development)
4. [Database Modifications](#database-modifications)
5. [Adding New Features](#adding-new-features)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Performance Optimization](#performance-optimization)

---

## Code Architecture

### Backend Flow

```
Request → Flask Route → Database Query → Response (JSON)
```

### Frontend Flow

```
User Action → JavaScript Event → API Call → Update DOM
```

### State Management

```javascript
appState = {
  transactions: [],      // Array of transaction objects
  categories: [],        // Array of category strings
  currentMonth: 'YYYY-MM', // Currently selected month
  filters: {},          // Applied filters
  charts: {}            // Chart.js instances
}
```

---

## Backend Development

### Adding a New Route

**File:** `app.py`

```python
@app.route('/api/new-endpoint', methods=['GET', 'POST'])
def new_endpoint():
    """
    Docstring explaining what this endpoint does
    """
    if request.method == 'POST':
        data = request.get_json()
        # Process data
        return jsonify({'message': 'Success'}), 201
    
    else:  # GET
        result = query_data()
        return jsonify(result)
```

### Adding a New Model

**File:** `models.py`

```python
class BudgetGoal(db.Model):
    """Model for budget goals/targets"""
    
    __tablename__ = 'budget_goals'
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    period = db.Column(db.String(20), default='monthly')  # weekly, monthly, yearly
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'target_amount': self.target_amount,
            'period': self.period
        }
```

### Database Queries

**Safe queries using SQLAlchemy:**

```python
# Get all transactions for a month
transactions = Transaction.query.filter(
    func.strftime('%Y-%m', Transaction.date) == '2024-01'
).all()

# Get specific transaction
transaction = Transaction.query.get(id)

# Count transactions
count = Transaction.query.count()

# Sum amounts by category
result = db.session.query(
    Transaction.category,
    func.sum(Transaction.amount)
).filter(Transaction.type == 'expense').group_by(Transaction.category).all()

# Order and limit
recent = Transaction.query.order_by(
    Transaction.date.desc()
).limit(10).all()
```

### Error Handling

```python
try:
    # Database operation
    db.session.add(transaction)
    db.session.commit()
except SQLAlchemyError as e:
    db.session.rollback()
    return jsonify({'error': str(e)}), 500
except Exception as e:
    return jsonify({'error': 'Internal server error'}), 500
```

### Adding Validation

```python
from flask import abort

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    
    # Validate input
    if not data.get('amount'):
        return jsonify({'error': 'Amount is required'}), 400
    
    if data.get('amount') <= 0:
        return jsonify({'error': 'Amount must be positive'}), 400
    
    if data.get('type') not in ['income', 'expense']:
        return jsonify({'error': 'Invalid type'}), 400
    
    # Process valid data...
```

---

## Frontend Development

### Adding a New API Call

**File:** `static/js/script.js`

```javascript
async function fetchNewData() {
    try {
        const response = await fetch('/api/new-endpoint', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('Error: ' + error.message, 'danger');
    }
}
```

### Adding a New Chart

```javascript
function createNewChart() {
    const ctx = document.getElementById('newChart').getContext('2d');
    
    if (appState.charts.newChart) {
        appState.charts.newChart.destroy();
    }
    
    appState.charts.newChart = new Chart(ctx, {
        type: 'bar',  // bar, line, pie, doughnut, etc.
        data: {
            labels: ['Jan', 'Feb', 'Mar'],
            datasets: [{
                label: 'Dataset Label',
                data: [10, 20, 30],
                backgroundColor: '#667eea',
                borderColor: '#764ba2',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: isDarkMode ? '#e0e0e0' : '#212529'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: isDarkMode ? '#e0e0e0' : '#212529'
                    }
                }
            }
        }
    });
}
```

### Adding a New HTML Form

```html
<form id="newForm">
    <div class="mb-3">
        <label for="newInput" class="form-label">Input Label</label>
        <input type="text" class="form-control" id="newInput" 
               placeholder="Placeholder text" required>
    </div>
    
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

**Add event listener:**

```javascript
document.getElementById('newForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        field: document.getElementById('newInput').value
    };
    
    try {
        const response = await fetch('/api/endpoint', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed');
        
        showAlert('Success!', 'success');
        // Reload data
        loadTransactions();
    } catch (error) {
        showAlert('Error: ' + error, 'danger');
    }
});
```

### Adding CSS Styles

**File:** `static/css/style.css`

```css
/* New component style */
.new-component {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s ease;
}

.new-component:hover {
    transform: translateY(-5px);
}

/* Dark mode support */
body.dark-mode .new-component {
    /* Automatically inherits from CSS variables */
}

/* Responsive */
@media (max-width: 768px) {
    .new-component {
        padding: 1rem;
    }
}
```

---

## Database Modifications

### Adding a New Column

1. **Update the Model** (`models.py`):

```python
class Transaction(db.Model):
    # ... existing columns ...
    new_column = db.Column(db.String(100), nullable=True)
```

2. **Create Migration** (Flask-Migrate):

```bash
# Install Flask-Migrate
pip install Flask-Migrate

# Initialize migrations
flask db init

# Create migration
flask db migrate -m "Add new_column to transactions"

# Apply migration
flask db upgrade
```

3. **Or Manual Update** (SQLite):

```bash
# Delete old database
rm budget_tracker.db

# Restart app to recreate with new schema
python app.py
```

### Adding a Relationship

```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    
    # Relationship
    transactions = db.relationship('Transaction', backref='user', lazy=True)


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
```

---

## Adding New Features

### Feature: Budget Alerts

**1. Add Model** (`models.py`):

```python
class BudgetAlert(db.Model):
    __tablename__ = 'budget_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    threshold = db.Column(db.Float, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'threshold': self.threshold,
            'is_active': self.is_active
        }
```

**2. Add Route** (`app.py`):

```python
@app.route('/api/alerts', methods=['GET', 'POST'])
def manage_alerts():
    if request.method == 'POST':
        data = request.get_json()
        alert = BudgetAlert(
            category=data['category'],
            threshold=data['threshold']
        )
        db.session.add(alert)
        db.session.commit()
        return jsonify(alert.to_dict()), 201
    
    alerts = BudgetAlert.query.filter_by(is_active=True).all()
    return jsonify([a.to_dict() for a in alerts])
```

**3. Add HTML**:

```html
<div class="card">
    <div class="card-header">Budget Alerts</div>
    <div class="card-body">
        <form id="alertForm">
            <input type="text" id="alertCategory" placeholder="Category">
            <input type="number" id="alertThreshold" placeholder="Threshold">
            <button type="submit">Add Alert</button>
        </form>
        <div id="alertsList"></div>
    </div>
</div>
```

**4. Add JavaScript**:

```javascript
document.getElementById('alertForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        category: document.getElementById('alertCategory').value,
        threshold: parseFloat(document.getElementById('alertThreshold').value)
    };
    
    const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    
    if (response.ok) {
        loadAlerts();
        document.getElementById('alertForm').reset();
    }
});

async function loadAlerts() {
    const response = await fetch('/api/alerts');
    const alerts = await response.json();
    
    const list = document.getElementById('alertsList');
    list.innerHTML = alerts.map(a => `
        <div class="alert-item">
            ${a.category}: ₹${a.threshold}
        </div>
    `).join('');
}
```

---

## Testing

### Manual Testing

```bash
# Test with curl
curl http://localhost:5000/api/transactions

# Test POST request
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount":500,"type":"expense","category":"Food","date":"2024-01-15"}'
```

### Unit Testing (Optional)

Create `test_app.py`:

```python
import unittest
from app import app, db
from models import Transaction

class TestBudgetTracker(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        
        with app.app_context():
            db.create_all()
    
    def test_add_transaction(self):
        response = self.app.post('/api/transactions', 
            json={
                'amount': 500,
                'type': 'expense',
                'category': 'Food',
                'date': '2024-01-15'
            }
        )
        self.assertEqual(response.status_code, 201)
    
    def test_get_transactions(self):
        response = self.app.get('/api/transactions')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
```

Run tests:

```bash
python -m pytest test_app.py
# or
python -m unittest test_app.py
```

---

## Debugging

### Enable Flask Debug Mode

Edit `app.py`:

```python
app.run(debug=True)  # Enables auto-reload and debugger
```

### Browser Developer Tools

Press `F12` to open:

1. **Console Tab**: See JavaScript errors and logs
2. **Network Tab**: Monitor API calls
3. **Storage Tab**: Check localStorage for dark mode
4. **Application Tab**: View cookies and data

### Server Logging

Add logging to `app.py`:

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/api/transactions')
def transactions():
    logger.info('Fetching transactions')
    logger.debug(f'Filters: {request.args}')
    # ...
```

### JavaScript Debugging

```javascript
// Console logging
console.log('Debug info:', variable);
console.error('Error:', error);
console.table(appState.transactions);

// Breakpoints
debugger;  // Execution pauses when DevTools open

// Try-catch with logging
try {
    // code
} catch (error) {
    console.error('Caught error:', error);
    console.trace();  // Stack trace
}
```

---

## Performance Optimization

### Database Query Optimization

```python
# Bad: N+1 queries
transactions = Transaction.query.all()
for t in transactions:
    print(t.user.name)  # Queries user for each transaction

# Good: Join query
transactions = Transaction.query.join(User).all()
```

### Frontend Optimization

```javascript
// Bad: Requerying same data
function updateUI() {
    const data1 = fetch('/api/data');
    const data2 = fetch('/api/data');  // Same endpoint!
}

// Good: Cache data
async function updateUI() {
    const data = await fetch('/api/data');
    // Use data multiple times
}
```

### Caching

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_categories():
    return db.session.query(Transaction.category).distinct().all()
```

---

## Environment Setup for Development

Create `.env.development`:

```env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///budget_tracker_dev.db
LOG_LEVEL=DEBUG
```

---

## Useful VS Code Extensions

- **Python**: ms-python.python
- **Pylance**: ms-python.vscode-pylance
- **Flask Snippets**: cstrap.flask-snippets
- **REST Client**: humao.rest-client
- **SQLite**: alexcvzz.vscode-sqlite

---

## Common Development Tasks

### Add a new transaction type

1. Update HTML enum values
2. Update JavaScript validation
3. Update CSS for styling
4. Test with new data

### Change database location

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///path/to/db.db'
```

### Add authentication

```python
from flask_login import LoginManager, login_required

login_manager = LoginManager()
login_manager.init_app(app)

@app.route('/api/transactions')
@login_required
def protected_route():
    # Only logged-in users can access
    pass
```

---

## Code Style & Best Practices

### Python Style (PEP 8)

```python
# Good
def add_transaction(amount, category):
    """Add a new transaction to database."""
    transaction = Transaction(amount=amount, category=category)
    return transaction

# Bad
def addTransaction(amt,cat):
    t=Transaction(amt,cat)
    return t
```

### JavaScript Style (ES6+)

```javascript
// Good
const loadData = async () => {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Bad
function loadData() {
    fetch('/api/data').then(r => r.json()).then(d => console.log(d));
}
```

---

**Happy coding! 🚀**

For more advanced topics, check the official documentation for Flask and SQLAlchemy.
