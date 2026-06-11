from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Initialize SQLAlchemy
db = SQLAlchemy()


class User(UserMixin, db.Model):
    """
    User Model - Represents user accounts
    
    Attributes:
        id: Unique identifier
        username: Unique username
        email: User email
        password_hash: Hashed password
        full_name: User's full name
        business_type: Type of business/category
        created_at: Account creation timestamp
        updated_at: Last update timestamp
        transactions: Relationship to user's transactions
        custom_categories: Relationship to user's custom categories
    """
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120), nullable=True)
    business_type = db.Column(db.String(50), default='personal')  # personal, freelance, retail, restaurant, etc.
    
    # Relationships
    transactions = db.relationship('Transaction', backref='user', lazy=True, cascade='all, delete-orphan')
    categories = db.relationship('Category', backref='user', lazy=True, cascade='all, delete-orphan')
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'business_type': self.business_type,
            'created_at': self.created_at.isoformat()
        }


class Category(db.Model):
    """
    Category Model - User-defined transaction categories
    
    Attributes:
        id: Unique identifier
        user_id: Foreign key to user
        name: Category name
        type: 'credited' or 'debited'
        color: Hex color code for charts
        created_at: Creation timestamp
    """
    
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'credited' or 'debited'
    color = db.Column(db.String(7), default='#007bff')  # Hex color
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Category {self.name}>'
    
    def to_dict(self):
        """Convert category to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'color': self.color
        }


class Transaction(db.Model):
    """
    Transaction Model - Represents income and expense entries
    
    Attributes:
        id: Unique identifier
        user_id: Foreign key to user
        amount: Transaction amount (float)
        category: Category of transaction
        type: Transaction type ('credited' or 'debited')
        date: Transaction date
        description: Optional description
        is_recurring: Whether transaction is recurring
        created_at: Timestamp when record was created
        updated_at: Timestamp when record was last updated
    """
    
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False, default='Other')
    type = db.Column(db.String(20), nullable=False)  # 'credited' or 'debited'
    date = db.Column(db.Date, nullable=False, default=datetime.today)
    description = db.Column(db.String(200), nullable=True)
    is_recurring = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Transaction {self.id}: {self.type} - ₹{self.amount} ({self.category})>'
    
    def to_dict(self):
        """Convert transaction to dictionary for JSON response"""
        return {
            'id': self.id,
            'amount': round(self.amount, 2),
            'category': self.category,
            'type': self.type,
            'date': self.date.strftime('%Y-%m-%d'),
            'description': self.description,
            'is_recurring': self.is_recurring,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @staticmethod
    def validate():
        """Validate transaction data before saving"""
        pass
