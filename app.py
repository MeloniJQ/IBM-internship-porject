<<<<<<< HEAD
=======
from dotenv import load_dotenv
# Load variables from .env into the process environment BEFORE anything
# below calls os.environ.get(...). Without this line, python-dotenv being
# installed does nothing — .env is never actually read when you run
# `python app.py` directly (only docker-compose's env_file: reads it for you).
load_dotenv()

>>>>>>> feature/gemini-integration
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Transaction, Category
from datetime import datetime, timedelta
from sqlalchemy import func
import csv
import io
import os
<<<<<<< HEAD
from werkzeug.security import generate_password_hash

=======
from dotenv import load_dotenv
import llm
from werkzeug.security import generate_password_hash

load_dotenv()

>>>>>>> feature/gemini-integration
# ==================== APPLICATION SETUP ====================

app = Flask(__name__)

# Configuration
<<<<<<< HEAD
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget_tracker.db'
=======
# DATABASE_URL can be overridden via environment variable (e.g. in Docker/production).
# Defaults to the original relative SQLite path used in local development.
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///budget_tracker.db')
>>>>>>> feature/gemini-integration
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
import random
import string

# Generate a random SECRET_KEY on each startup (invalidates old session cookies)
app.config['SECRET_KEY'] = ''.join(random.choices(string.ascii_letters + string.digits, k=32))

# Session Configuration - Use ONLY memory (don't save to disk)
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_REFRESH_EACH_REQUEST'] = True
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_TYPE'] = 'null'  # ← ADD THIS LINE - Don't persist sessions

# Import Session extension for null sessions
from flask.sessions import SessionMixin
# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'
login_manager.session_protection = "strong"  # Add this line - strong session protection
login_manager.login_message_category = 'info'

# Create database tables
with app.app_context():
    db.create_all()



# ==================== CLEAR SESSIONS ON APP STARTUP ====================

# Force logout all users when app starts
@app.before_request
def before_request():
    """Run before each request"""
    from flask import session
    # Sessions won't persist due to SESSION_TYPE = 'null'
    pass
# ==================== USER LOADER ====================

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


# ==================== ROOT ROUTE ====================

@app.route('/')
def index():
    """Root route - redirect to login or dashboard"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

# ==================== BUSINESS TYPE CATEGORIES ====================

BUSINESS_CATEGORIES = {
    'personal': {
        'credited': ['Salary', 'Freelance', 'Investment', 'Bonus', 'Refund', 'Gift'],
        'debited': ['Food', 'Transport', 'Rent', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Bills', 'Subscriptions', 'Personal Care']
    },
    'freelancer': {
        'credited': ['Project Income', 'Consulting', 'Retainer', 'Bonus', 'Refund'],
        'debited': ['Office Supplies', 'Software Tools', 'Internet', 'Phone', 'Transportation', 'Food', 'Equipment', 'Professional Development', 'Taxes', 'Insurance']
    },
    'retail': {
        'credited': ['Sales', 'Returns Received', 'Discounts Given', 'Other Income'],
        'debited': ['Inventory', 'Staff Salary', 'Rent', 'Utilities', 'Marketing', 'Equipment', 'Maintenance', 'Shipping', 'Packaging', 'Licenses']
    },
    'restaurant': {
        'credited': ['Food Sales', 'Beverage Sales', 'Catering', 'Delivery', 'Other Revenue'],
        'debited': ['Food Cost', 'Beverages', 'Staff Salary', 'Rent', 'Utilities', 'Equipment', 'Maintenance', 'Licenses', 'Marketing', 'Waste']
    },
    'service': {
        'credited': ['Service Revenue', 'Consultation', 'Subscription', 'Retainer', 'Other Income'],
        'debited': ['Staff Salary', 'Office Rent', 'Utilities', 'Insurance', 'Equipment', 'Marketing', 'Software', 'Travel', 'Training', 'Supplies']
    },
    'ecommerce': {
        'credited': ['Product Sales', 'Digital Sales', 'Advertising Revenue', 'Affiliate Income', 'Other Revenue'],
        'debited': ['Product Cost', 'Shipping', 'Platform Fees', 'Marketing', 'Server Cost', 'Payment Processing', 'Packaging', 'Customer Service', 'Returns', 'Inventory']
    },
    'startup': {
        'credited': ['Funding', 'Revenue', 'Investment', 'Grants', 'Other Income'],
        'debited': ['Salaries', 'Office', 'Development', 'Marketing', 'Equipment', 'Legal', 'Insurance', 'Infrastructure', 'Tools', 'Miscellaneous']
    }
}


# ==================== AUTH ROUTES ====================

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration page and handler"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        full_name = request.form.get('full_name')
        business_type = request.form.get('business_type', 'personal')
        
        # Validation
        if not username or not email or not password:
            flash('All fields are required!', 'error')
            return redirect(url_for('register'))
        
        if len(password) < 6:
            flash('Password must be at least 6 characters!', 'error')
            return redirect(url_for('register'))
        
        if password != confirm_password:
            flash('Passwords do not match!', 'error')
            return redirect(url_for('register'))
        
        # Check if user exists
        if User.query.filter_by(username=username).first():
            flash('Username already taken!', 'error')
            return redirect(url_for('register'))
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered!', 'error')
            return redirect(url_for('register'))
        
        try:
            # Create new user
            user = User(
                username=username,
                email=email,
                full_name=full_name,
                business_type=business_type
            )
            user.set_password(password)
            
            db.session.add(user)
            db.session.commit()
            
            # Create default categories based on business type
            categories_config = BUSINESS_CATEGORIES.get(business_type, BUSINESS_CATEGORIES['personal'])
            
            colors_credited = ['#28a745', '#20c997', '#17a2b8', '#0dcaf0', '#6f42c1', '#e83e8c']
            colors_debited = ['#dc3545', '#fd7e14', '#ffc107', '#6c757d', '#ff6b6b', '#ee5a6f']
            
            color_idx_credited = 0
            color_idx_debited = 0
            
            for cat in categories_config.get('credited', []):
                category = Category(
                    name=cat,
                    type='credited',
                    user_id=user.id,
                    color=colors_credited[color_idx_credited % len(colors_credited)]
                )
                color_idx_credited += 1
                db.session.add(category)
            
            for cat in categories_config.get('debited', []):
                category = Category(
                    name=cat,
                    type='debited',
                    user_id=user.id,
                    color=colors_debited[color_idx_debited % len(colors_debited)]
                )
                color_idx_debited += 1
                db.session.add(category)
            
            db.session.commit()
            
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('login'))
        
        except Exception as e:
            db.session.rollback()
            flash(f'Error creating account: {str(e)}', 'error')
            return redirect(url_for('register'))
    
    business_types = list(BUSINESS_CATEGORIES.keys())
    return render_template('register.html', business_types=business_types)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login page and handler"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            flash('Username and password are required!', 'error')
            return redirect(url_for('login'))
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            session.permanent = False                   # Don't persist session
            login_user(user, remember=False)            # Don't remember user
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password!', 'error')
    
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    """Logout user"""
    logout_user()
    flash('You have been logged out successfully!', 'success')
    return redirect(url_for('login'))


# ==================== DASHBOARD ROUTE ====================

@app.route('/dashboard')
@login_required
def dashboard():
    """Dashboard page - shows overview with graphs"""
    month = request.args.get('month', datetime.today().strftime('%Y-%m'))
    
    return render_template('dashboard.html', month=month)


# ==================== TRANSACTIONS ROUTE ====================

@app.route('/transactions')
@login_required
def transactions_page():
    """Transactions management page"""
    return render_template('transactions.html')


# ==================== ANALYTICS ROUTE ====================

@app.route('/analytics')
@login_required
def analytics_page():
    """Analytics and reports page"""
    return render_template('analytics.html')


# ==================== SETTINGS ROUTE ====================

@app.route('/settings')
@login_required
def settings_page():
    """Settings page for user preferences and categories"""
    return render_template('settings.html')


# ==================== API - TRANSACTIONS ====================

@app.route('/api/transactions', methods=['GET', 'POST'])
@login_required
def api_transactions():
    """Get or create transactions for current user"""
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validate input
            if not all(k in data for k in ['amount', 'category', 'date', 'type']):
                return jsonify({'error': 'Missing required fields'}), 400
            
            # Create new transaction
            transaction = Transaction(
                user_id=current_user.id,
                amount=float(data['amount']),
                category=data['category'],
                date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
                type=data['type'],
                description=data.get('description', ''),
                is_recurring=data.get('is_recurring', False)
            )
            
            db.session.add(transaction)
            db.session.commit()
            
            return jsonify({
                'id': transaction.id,
                'message': 'Transaction added successfully'
            }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    else:  # GET request
        # Apply filters
        category = request.args.get('category')
        type_filter = request.args.get('type')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        month = request.args.get('month')
        
        query = Transaction.query.filter_by(user_id=current_user.id)
        
        if category:
            query = query.filter_by(category=category)
        if type_filter:
            query = query.filter_by(type=type_filter)
        if month:
            year, mon = map(int, month.split('-'))
            query = query.filter(
                func.strftime('%Y-%m', Transaction.date) == f'{year:04d}-{mon:02d}'
            )
        if start_date and end_date:
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(Transaction.date.between(start, end))
        
        transactions_list = query.order_by(Transaction.date.desc()).all()
        
        return jsonify([t.to_dict() for t in transactions_list])


@app.route('/api/transactions/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def api_transaction_detail(id):
    """Get, update, or delete a specific transaction"""
    
    transaction = Transaction.query.get_or_404(id)
    
    # Ensure user owns this transaction
    if transaction.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        return jsonify(transaction.to_dict())
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            if 'amount' in data:
                transaction.amount = float(data['amount'])
            if 'category' in data:
                transaction.category = data['category']
            if 'date' in data:
                transaction.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            if 'type' in data:
                transaction.type = data['type']
            if 'description' in data:
                transaction.description = data['description']
            if 'is_recurring' in data:
                transaction.is_recurring = data['is_recurring']
            
            db.session.commit()
            return jsonify({'message': 'Transaction updated successfully'})
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(transaction)
            db.session.commit()
            return jsonify({'message': 'Transaction deleted successfully'})
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


# ==================== API - SUMMARY ====================

@app.route('/api/summary', methods=['GET'])
@login_required
def api_summary():
    """Get monthly summary with totals and category breakdown"""
    
    month = request.args.get('month')
    
    if not month:
        today = datetime.today()
        month = today.strftime('%Y-%m')
    
    year, mon = map(int, month.split('-'))
    
    # Get all transactions for the month for current user
    transactions_list = Transaction.query.filter(
        Transaction.user_id == current_user.id,
        func.strftime('%Y-%m', Transaction.date) == f'{year:04d}-{mon:02d}'
    ).all()
    
    # Calculate totals
    total_credited = sum(t.amount for t in transactions_list if t.type == 'credited')
    total_debited = sum(t.amount for t in transactions_list if t.type == 'debited')
    balance = total_credited - total_debited
    
    # Category breakdown
    category_breakdown = {}
    for transaction in transactions_list:
        if transaction.type == 'debited':
            if transaction.category not in category_breakdown:
                category_breakdown[transaction.category] = 0
            category_breakdown[transaction.category] += transaction.amount
    
    return jsonify({
        'month': month,
        'total_credited': round(total_credited, 2),
        'total_debited': round(total_debited, 2),
        'balance': round(balance, 2),
        'category_breakdown': {k: round(v, 2) for k, v in category_breakdown.items()}
    })


# ==================== API - MONTHLY STATS ====================

@app.route('/api/monthly-stats', methods=['GET'])
@login_required
def api_monthly_stats():
    """Get stats for last 12 months for charting"""
    
    stats = []
    
    for i in range(11, -1, -1):
        date = datetime.today() - timedelta(days=30*i)
        month_str = date.strftime('%Y-%m')
        year, mon = map(int, month_str.split('-'))
        
        transactions_list = Transaction.query.filter(
            Transaction.user_id == current_user.id,
            func.strftime('%Y-%m', Transaction.date) == f'{year:04d}-{mon:02d}'
        ).all()
        
        total_credited = sum(t.amount for t in transactions_list if t.type == 'credited')
        total_debited = sum(t.amount for t in transactions_list if t.type == 'debited')
        
        stats.append({
            'month': date.strftime('%b %Y'),
            'credited': round(total_credited, 2),
            'debited': round(total_debited, 2),
            'balance': round(total_credited - total_debited, 2)
        })
    
    return jsonify(stats)


# ==================== API - CATEGORIES ====================

@app.route('/api/categories', methods=['GET', 'POST'])
@login_required
def api_categories():
    """Get or create custom categories for current user"""
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            category = Category(
                user_id=current_user.id,
                name=data.get('name'),
                type=data.get('type'),
                color=data.get('color', '#007bff')
            )
            
            db.session.add(category)
            db.session.commit()
            
            return jsonify(category.to_dict()), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    else:
        categories = Category.query.filter_by(user_id=current_user.id).all()
        return jsonify([c.to_dict() for c in categories])


@app.route('/api/categories/<int:id>', methods=['PUT', 'DELETE'])
@login_required
def api_category_detail(id):
    """Update or delete a category"""
    
    category = Category.query.get_or_404(id)
    
    if category.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'PUT':
        try:
            data = request.get_json()
            
            if 'name' in data:
                category.name = data['name']
            if 'color' in data:
                category.color = data['color']
            
            db.session.commit()
            return jsonify({'message': 'Category updated'})
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(category)
            db.session.commit()
            return jsonify({'message': 'Category deleted'})
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


# ==================== API - EXPORT ====================

@app.route('/api/export-csv', methods=['GET'])
@login_required
def api_export_csv():
    """Export user's transactions as CSV"""
    
    try:
        transactions_list = Transaction.query.filter_by(user_id=current_user.id).all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(['ID', 'Amount', 'Category', 'Type', 'Date', 'Description', 'Is Recurring'])
        
        for t in transactions_list:
            writer.writerow([
                t.id,
                t.amount,
                t.category,
                t.type,
                t.date.strftime('%Y-%m-%d'),
                t.description,
                'Yes' if t.is_recurring else 'No'
            ])
        
        output.seek(0)
        bytes_io = io.BytesIO(output.getvalue().encode('utf-8'))
        
        from flask import send_file
        return send_file(
            bytes_io,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f"transactions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== API - USER PROFILE ====================

@app.route('/api/user', methods=['GET', 'PUT'])
@login_required
def api_user():
    """Get or update user profile"""
    
    if request.method == 'GET':
        return jsonify(current_user.to_dict())
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            if 'full_name' in data:
                current_user.full_name = data['full_name']
            if 'email' in data:
                current_user.email = data['email']
            
            db.session.commit()
            return jsonify({'message': 'Profile updated'})
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


<<<<<<< HEAD
=======
import re

MONTH_NAMES = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
]


def _detect_requested_month(question, default_year=None):
    """Look for an explicit month mention in the user's question
    (e.g. 'July 2026', 'last month', 'this month') and return (month, year)
    if found, else (None, None).
    """
    q = question.lower()
    today = datetime.now()

    if 'this month' in q:
        return today.month, today.year

    if 'last month' in q:
        first_of_this_month = today.replace(day=1)
        last_month_date = first_of_this_month - timedelta(days=1)
        return last_month_date.month, last_month_date.year

    year_match = re.search(r'\b(20\d{2})\b', q)
    year = int(year_match.group(1)) if year_match else default_year

    for idx, name in enumerate(MONTH_NAMES, start=1):
        if name in q:
            return idx, (year or today.year)

    return None, None


def build_financial_context(user, question="", max_transactions=200):
    """Summarize the current user's real transactions into a compact text
    block that can be prepended to their prompt, so the assistant is
    actually answering from their data instead of guessing.

    Includes:
      - all-time totals
      - a month-by-month breakdown (so "net profit in July 2026" style
        questions can be checked against real numbers, not guessed)
      - an exact, pre-computed answer for the specific month mentioned in
        the question, if any (so the LLM doesn't have to do the date math)
      - the most recent transactions in detail
    """
    txns = (
        Transaction.query
        .filter(Transaction.user_id == user.id)
        .order_by(Transaction.date.desc())
        .all()
    )

    if not txns:
        return "The user has no recorded transactions at all."

    total_in = sum(t.amount for t in txns if t.type == 'credited')
    total_out = sum(t.amount for t in txns if t.type == 'debited')

    # Month-by-month breakdown, oldest to newest
    by_month = {}
    for t in txns:
        key = t.date.strftime('%Y-%m')
        bucket = by_month.setdefault(key, {'in': 0.0, 'out': 0.0})
        if t.type == 'credited':
            bucket['in'] += t.amount
        else:
            bucket['out'] += t.amount

    monthly_lines = "\n".join(
        f"  - {month}: income={vals['in']:.2f}, expenses={vals['out']:.2f}, "
        f"net_profit={vals['in'] - vals['out']:.2f}"
        for month, vals in sorted(by_month.items())
    )

    by_category = {}
    for t in txns:
        if t.type == 'debited':
            by_category[t.category] = by_category.get(t.category, 0) + t.amount

    top_categories = sorted(by_category.items(), key=lambda kv: kv[1], reverse=True)[:8]
    category_lines = "\n".join(f"  - {cat}: {amt:.2f}" for cat, amt in top_categories)

    recent = txns[:max_transactions]
    recent_lines = "\n".join(
        f"  - {t.date.strftime('%Y-%m-%d')} | {t.type} | {t.category} | {t.amount:.2f} | {t.description or ''}"
        for t in recent
    )

    # If the question names a specific month, pre-compute the exact
    # answer for it directly in Python so the assistant just has to
    # report a real number instead of estimating one.
    month_num, year = _detect_requested_month(question)
    requested_month_block = ""
    if month_num:
        key = f"{year:04d}-{month_num:02d}"
        vals = by_month.get(key)
        month_label = datetime(year, month_num, 1).strftime('%B %Y')
        if vals:
            requested_month_block = (
                f"\nEXACT ANSWER FOR {month_label}: "
                f"income={vals['in']:.2f}, expenses={vals['out']:.2f}, "
                f"net_profit={vals['in'] - vals['out']:.2f}. "
                f"Use these exact numbers if the question asks about {month_label}.\n"
            )
        else:
            requested_month_block = (
                f"\nNOTE: The user's question appears to ask about {month_label}, "
                f"but there are no transactions recorded for that month.\n"
            )

    return (
        f"Financial summary for {user.full_name or user.username} "
        f"(business type: {user.business_type}), all-time:\n"
        f"Total income: {total_in:.2f}\n"
        f"Total expenses: {total_out:.2f}\n"
        f"Net: {total_in - total_out:.2f}\n"
        f"{requested_month_block}"
        f"Month-by-month breakdown:\n{monthly_lines}\n"
        f"Top spending categories (all-time):\n{category_lines}\n"
        f"Transactions (most recent {len(recent)} of {len(txns)}):\n{recent_lines}"
    )


# ==================== API - GEMINI / LLM INTEGRATION ====================

def _build_financial_context(user):
    """Summarize the user's transactions by month so the assistant can answer
    questions about actual income/expense/profit instead of guessing."""
    rows = db.session.query(
        func.strftime('%Y-%m', Transaction.date).label('month'),
        Transaction.type,
        func.sum(Transaction.amount)
    ).filter(
        Transaction.user_id == user.id
    ).group_by('month', Transaction.type).order_by('month').all()

    monthly = {}
    for month, ttype, total in rows:
        monthly.setdefault(month, {'credited': 0.0, 'debited': 0.0})
        monthly[month][ttype] = float(total)

    if not monthly:
        return "The user has no recorded transactions yet."

    lines = ["Monthly financial summary (currency: INR):"]
    for month in sorted(monthly.keys()):
        income = monthly[month]['credited']
        expense = monthly[month]['debited']
        profit = income - expense
        lines.append(
            f"- {month}: income {income:.2f}, expense {expense:.2f}, profit {profit:.2f}"
        )
    return "\n".join(lines)


@app.route('/api/gemini', methods=['POST'])
@login_required
def api_gemini():
    """Proxy endpoint to send prompts to configured Gemini-compatible API.

    Expects JSON: { "prompt": "..." }
    Returns: { "response": "..." }

    The user's own prompt is combined with a summary of their real
    transaction data, so the assistant can actually answer budget
    questions ("how much did I spend on X") instead of just guessing.
    """
    data = request.get_json() or {}
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({'error': 'Missing prompt'}), 400

    model = data.get('model')
    max_tokens = data.get('max_tokens', 512)

    context = _build_financial_context(current_user)
    full_prompt = (
        "You are a budgeting assistant. Answer the user's question using ONLY "
        "the financial data below. If the data doesn't cover the period or "
        "detail asked about, say so explicitly instead of guessing.\n\n"
        f"{context}\n\nQuestion: {prompt}"
    )

    try:
        result = llm.ask_gemini(full_prompt, model=model, max_tokens=max_tokens)
        return jsonify({'response': result})
    except llm.GeminiError as e:
        # Config/auth/rate-limit errors from the LLM provider — surfaced as a
        # clear message instead of a generic 500 with a raw exception string.
        return jsonify({'error': str(e)}), 502
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Server-to-server API key protected endpoint (useful for service testing)
@app.route('/api/gemini_key', methods=['POST'])
def api_gemini_key():
    """Server-to-server endpoint protected by X-API-KEY header matching GEMINI_SERVER_KEY.

    If `GEMINI_SERVER_KEY` is not set in the environment, the endpoint will accept requests
    but will include a warning in the response; this is deliberate to make local testing easier.
    """
    provided = request.headers.get('X-API-KEY')
    server_key = os.environ.get('GEMINI_SERVER_KEY')

    if server_key:
        if not provided or provided != server_key:
            return jsonify({'error': 'Invalid or missing API key'}), 403
    # else: allow but warn

    data = request.get_json() or {}
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({'error': 'Missing prompt'}), 400

    model = data.get('model')
    max_tokens = data.get('max_tokens', 512)

    try:
        result = llm.ask_gemini(prompt, model=model, max_tokens=max_tokens)
        resp = {'response': result}
        if not server_key:
            resp['_note'] = 'GEMINI_SERVER_KEY not set; endpoint allowed for local testing.'
        return jsonify(resp)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


>>>>>>> feature/gemini-integration
# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500


@app.errorhandler(403)
def forbidden(error):
    return render_template('403.html'), 403


if __name__ == '__main__':
<<<<<<< HEAD
    app.run(debug=True, host='0.0.0.0', port=5000)
=======
    debug_mode = os.environ.get('FLASK_DEBUG', 'true').lower() in ('1', 'true', 'yes')
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
>>>>>>> feature/gemini-integration
