# 🚀 Quick Start Guide

Get the Budget Tracker running in 5 minutes!

## Prerequisites Check

Make sure you have:
- ✅ Python 3.8+ installed (`python --version`)
- ✅ pip installed (`pip --version`)

---

## Installation (Windows)

```bash
# Step 1: Open Command Prompt in the project folder
# Right-click folder → "Open Command Prompt here"

# Step 2: Create virtual environment
python -m venv venv

# Step 3: Activate virtual environment
venv\Scripts\activate

# Step 4: Install dependencies
pip install -r requirements.txt

# Step 5: Run the app
python app.py

# Step 6: Open browser
# Visit: http://localhost:5000
```

---

## Installation (macOS/Linux)

```bash
# Step 1: Open Terminal in the project folder
# cd /path/to/budget-tracker

# Step 2: Create virtual environment
python3 -m venv venv

# Step 3: Activate virtual environment
source venv/bin/activate

# Step 4: Install dependencies
pip install -r requirements.txt

# Step 5: Run the app
python app.py

# Step 6: Open browser
# Visit: http://localhost:5000
```

---

## Verify Installation

After running `python app.py`, you should see:

```
 * Serving Flask app 'app'
 * Debug mode: on
 * WARNING in app.run()
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

---

## Common Issues

### Issue: `ModuleNotFoundError: No module named 'flask'`

**Solution:** Activate virtual environment first
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### Issue: `Port 5000 is already in use`

**Solution:** Change the port in `app.py` (line at the bottom):
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change to 5001
```

### Issue: Nothing loads in browser

**Solution:** 
1. Check the terminal - are there any error messages?
2. Make sure you're visiting `http://localhost:5000` (not https)
3. Try clearing browser cache (Ctrl+Shift+Delete)

---

## First Use

1. **Add an Income Entry**
   - Type: Income
   - Category: Salary
   - Amount: 50000
   - Date: Today
   - Click "Add Transaction"

2. **Add an Expense Entry**
   - Type: Expense
   - Category: Food
   - Amount: 500
   - Date: Today
   - Click "Add Transaction"

3. **View Dashboard**
   - See the summary cards update
   - Watch the charts populate
   - Check the transaction table

---

## Next Steps

- Read [README.md](README.md) for full documentation
- Explore the [API Documentation](README.md#-api-documentation)
- Check out [Advanced Features](README.md#-features)

---

## Stopping the App

Press `CTRL+C` in the terminal where the app is running.

---

## Running Again Later

```bash
# Just activate and run
# Windows
venv\Scripts\activate
python app.py

# macOS/Linux
source venv/bin/activate
python app.py
```

---

## Need Help?

1. Check the troubleshooting section in README.md
2. Look at browser console errors (F12)
3. Check terminal for Python errors
4. Try deleting `budget_tracker.db` and restarting

---

**You're all set! Happy budgeting! 💰**
