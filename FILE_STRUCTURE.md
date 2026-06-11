# 📁 Project Structure & File Overview

Complete guide to the Budget Tracker project structure and all files.

---

## Directory Tree

```
budget-tracker/
│
├── 📄 app.py                      # Main Flask application (Backend)
├── 📄 models.py                   # Database models (ORM)
├── 📄 requirements.txt            # Python dependencies
├── 📄 .env.example                # Environment variables template
├── 📄 .gitignore                  # Git ignore rules
│
├── 📘 README.md                   # Full documentation
├── 📘 QUICKSTART.md               # Quick setup guide (5 min)
├── 📘 DEVELOPER_GUIDE.md          # Development guide
├── 📘 DEPLOYMENT.md               # Deployment instructions
├── 📘 FAQ.md                      # FAQs and tips
├── 📘 FILE_STRUCTURE.md           # This file
│
├── 📁 templates/
│   └── 📄 index.html              # Main HTML template
│
├── 📁 static/
│   ├── 📁 css/
│   │   └── 📄 style.css           # Custom CSS & styling
│   └── 📁 js/
│       └── 📄 script.js           # Frontend JavaScript
│
└── 🗄️ budget_tracker.db          # SQLite database (auto-created)
```

---

## File Descriptions

### Core Application Files

#### `app.py` (Main Backend)
- **Purpose**: Flask application server
- **Size**: ~400 lines
- **Contains**:
  - Route handlers for all API endpoints
  - Database configuration
  - Error handlers
  - CORS setup
- **Key Functions**:
  - `/api/transactions` - CRUD operations
  - `/api/summary` - Monthly summaries
  - `/api/export-csv` - Data export
  - `/api/check-overspend` - Alert checks

#### `models.py` (Database Schema)
- **Purpose**: SQLAlchemy ORM models
- **Size**: ~60 lines
- **Contains**:
  - `Transaction` model definition
  - Database columns and constraints
  - Helper methods (to_dict)
  - Validation methods

#### `requirements.txt` (Dependencies)
- **Purpose**: Python package dependencies
- **Size**: 5 lines
- **Contains**:
  - Flask 2.3.3
  - Flask-SQLAlchemy 3.0.5
  - SQLAlchemy 2.0.21
  - Werkzeug 2.3.7
  - python-dotenv 1.0.0

---

### Frontend Files

#### `templates/index.html` (Main Interface)
- **Purpose**: Single-page HTML template
- **Size**: ~350 lines
- **Contains**:
  - Responsive Bootstrap layout
  - Form for adding transactions
  - Filters and search
  - Charts container
  - Transaction table
  - Modal for editing
  - Navigation bar

#### `static/css/style.css` (Styling)
- **Purpose**: Custom CSS with theming
- **Size**: ~800 lines
- **Contains**:
  - CSS variables for theming
  - Dark mode support
  - Responsive design
  - Component styling
  - Animations
  - Accessibility features

#### `static/js/script.js` (Frontend Logic)
- **Purpose**: JavaScript for interactivity
- **Size**: ~800 lines
- **Contains**:
  - State management
  - API calls (fetch)
  - Event listeners
  - DOM manipulation
  - Chart.js integration
  - Dark mode toggle
  - Form validation
  - Data filtering

---

### Documentation Files

#### `README.md` (Main Documentation)
- **Size**: ~600 lines
- **Includes**:
  - Feature overview
  - Tech stack details
  - Installation instructions
  - Usage guide
  - API documentation
  - Database schema
  - Configuration guide
  - Troubleshooting
  - Contributing guidelines

#### `QUICKSTART.md` (Fast Setup)
- **Size**: ~100 lines
- **Includes**:
  - 5-minute setup
  - Platform-specific instructions
  - Common issues
  - First use guide

#### `DEVELOPER_GUIDE.md` (Code Reference)
- **Size**: ~700 lines
- **Includes**:
  - Architecture explanation
  - Backend development guide
  - Frontend development guide
  - Database modifications
  - Adding features
  - Testing guide
  - Debugging tips
  - Performance optimization

#### `DEPLOYMENT.md` (Hosting Guide)
- **Size**: ~500 lines
- **Includes**:
  - Local network setup
  - Heroku deployment
  - PythonAnywhere
  - AWS setup
  - Docker configuration
  - Production checklist
  - Monitoring setup

#### `FAQ.md` (Questions & Tips)
- **Size**: ~400 lines
- **Includes**:
  - Frequently asked questions
  - Usage tips
  - Troubleshooting
  - Best practices
  - Customization guide

#### `FILE_STRUCTURE.md` (This File)
- **Size**: This file
- **Includes**:
  - Complete directory tree
  - File descriptions
  - File purposes
  - Quick reference

---

### Configuration Files

#### `.env.example` (Environment Template)
- **Purpose**: Template for environment variables
- **Usage**: Copy to `.env` and customize
- **Contains**:
  - Flask settings
  - Database URL
  - Secret key
  - Server configuration
  - Feature flags
  - Logging settings

#### `.gitignore` (Git Ignore Rules)
- **Purpose**: Exclude unnecessary files from git
- **Contains**:
  - Python cache files
  - Virtual environment
  - Database file
  - IDE settings
  - OS files
  - Logs

---

## File Relationships

```
User → Browser → index.html
              ↓
         script.js
              ↓
         API Calls
              ↓
         app.py (Routes)
              ↓
         models.py (ORM)
              ↓
         budget_tracker.db (SQLite)
```

---

## File Size Summary

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| app.py | 400+ | 15 KB | Backend |
| script.js | 800+ | 28 KB | Frontend |
| style.css | 800+ | 32 KB | Styling |
| index.html | 350+ | 14 KB | Structure |
| models.py | 60+ | 2 KB | Database |
| README.md | 600+ | 25 KB | Docs |

**Total**: ~2,500 lines of code + 50+ KB documentation

---

## How to Navigate Files

### For Users:
1. Start with `QUICKSTART.md` - Get running fast
2. Read `README.md` - Understand features
3. Check `FAQ.md` - Find answers
4. Use `DEPLOYMENT.md` - Deploy online

### For Developers:
1. Read `README.md` - Overview
2. Study `DEVELOPER_GUIDE.md` - Understand code
3. Look at `app.py` - Backend logic
4. Look at `script.js` - Frontend logic
5. Check `DEPLOYMENT.md` - Deploy

### For Customizers:
1. Edit `style.css` - Change colors
2. Edit `index.html` - Change layout
3. Edit `app.py` - Add endpoints
4. Edit `script.js` - Add functions

---

## Adding New Files

When expanding the project, consider:

### New Backend File
```
budget-tracker/
├── app.py          (main)
├── models.py       (existing)
├── auth.py         (NEW - authentication)
├── utils.py        (NEW - helpers)
└── config.py       (NEW - configuration)
```

### New Frontend File
```
static/
├── css/
│   ├── style.css
│   └── theme.css         (NEW - themes)
└── js/
    ├── script.js
    ├── charts.js         (NEW - chart logic)
    └── api.js            (NEW - API calls)
```

---

## File Naming Conventions

### Python Files
- Use lowercase with underscores
- Examples: `app.py`, `models.py`, `utils.py`

### HTML Files
- Use lowercase
- Examples: `index.html`, `dashboard.html`

### CSS Files
- Use lowercase with underscores
- Examples: `style.css`, `responsive.css`

### JavaScript Files
- Use camelCase for functions
- Use snake_case for file names
- Examples: `script.js`, `chart_utils.js`

### Documentation Files
- Use UPPERCASE with underscores
- Examples: `README.md`, `QUICKSTART.md`

---

## File Access Patterns

### Static Files
```
Browser → GET /static/css/style.css
       → GET /static/js/script.js
```

### Dynamic Routes
```
Browser → GET /                 (HTML)
       → GET /api/transactions  (JSON)
       → POST /api/transactions (JSON)
```

### Database Access
```
app.py → models.py → SQLAlchemy → budget_tracker.db
```

---

## Modifying Files

### Safe to Modify:
- ✅ style.css - Change colors, fonts
- ✅ script.js - Add functions
- ✅ index.html - Change layout
- ✅ .env.example - Add variables
- ✅ requirements.txt - Add packages

### Caution When Modifying:
- ⚠️ app.py - Affects API
- ⚠️ models.py - Affects database
- ⚠️ README.md - Keep it accurate

### Don't Modify:
- ❌ budget_tracker.db - Contains your data!
- ❌ .gitignore - Unless you know git

---

## File Encoding

All files are UTF-8 encoded:

```
- app.py → UTF-8 with BOM (optional)
- style.css → UTF-8 (no BOM)
- index.html → UTF-8 with declaration
- script.js → UTF-8 (no BOM)
```

---

## Version Control

### Files to Commit
```
app.py
models.py
requirements.txt
templates/
static/
README.md
.gitignore
```

### Files to NOT Commit
```
budget_tracker.db         (Data file)
.env                      (Secrets)
venv/                     (Virtual env)
__pycache__/              (Compiled Python)
.vscode/                  (IDE settings)
```

---

## Quick File Reference

### I want to...

**Add a new page?**
- Create new HTML in `templates/`
- Add route in `app.py`
- Add links in `index.html`

**Change colors?**
- Edit `static/css/style.css`
- Modify CSS variables in `:root`

**Add new API endpoint?**
- Add function in `app.py`
- Add fetch call in `script.js`
- Test with curl or Postman

**Modify database?**
- Update `models.py`
- Delete `budget_tracker.db`
- Restart app to recreate

**Change button text?**
- Edit `templates/index.html`
- Search for button text
- Update label

**Add dark mode to new component?**
- Use CSS variables
- Test with `.dark-mode` class
- Works automatically!

---

## File Dependencies

```
index.html
  ↓
  ├─→ Bootstrap CSS
  ├─→ Font Awesome Icons
  ├─→ Chart.js
  └─→ script.js
        ↓
        └─→ app.py API endpoints
              ↓
              └─→ models.py ORM
                    ↓
                    └─→ budget_tracker.db
```

---

## Backup Important Files

### Critical Files (Backup Regularly)
- 🔴 budget_tracker.db - Your data!
- 🔴 Customized style.css - Your styling
- 🔴 Customized script.js - Your functions

### Less Critical (Commit to Git)
- 🟡 app.py - Easy to recover
- 🟡 models.py - Easy to recover
- 🟡 Documentation - Easy to recover

---

## File Permissions (Linux/Mac)

```bash
# Make app.py executable
chmod +x app.py

# Make templates readable
chmod 644 templates/*

# Make static files readable
chmod -R 644 static/
```

---

## Storage Location

### Default Installation
```bash
C:\Users\YourName\Documents\budget-tracker\  (Windows)
~/Documents/budget-tracker/                  (macOS)
~/budget-tracker/                            (Linux)
```

### Database Location
```
Same folder as app.py
budget_tracker.db ← Here
```

### Backup Locations
```
Budget_tracker_backup_2024_01.db
Budget_tracker_backup_2024_02.db
```

---

## Next Steps

1. **Review Files**: Check each file to understand structure
2. **Run Locally**: Follow QUICKSTART.md
3. **Customize**: Edit files to match your needs
4. **Deploy**: Follow DEPLOYMENT.md when ready
5. **Contribute**: Share improvements back to community

---

**Understanding the file structure is key to customizing your app! 🔑**

For detailed information on any file, check:
- **Backend files** → DEVELOPER_GUIDE.md
- **Frontend files** → DEVELOPER_GUIDE.md
- **Setup issues** → FAQ.md
- **Deployment** → DEPLOYMENT.md
