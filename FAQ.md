# ❓ FAQ & Tips

Common questions and helpful tips for using the Budget Tracker.

---

## General Questions

### Q: Do I need an internet connection to use the app?

**A:** No! The app runs entirely on your local machine. It only needs internet if you decide to deploy it online.

### Q: Can multiple people use the app on the same computer?

**A:** Currently, yes - but all data is shared. In the future, we plan to add user authentication for separate accounts.

### Q: Where is my data stored?

**A:** In a file called `budget_tracker.db` in your project folder. This is a SQLite database file. Keep it safe!

### Q: How do I backup my data?

**A:** Simply copy the `budget_tracker.db` file to a safe location or USB drive.

### Q: Can I restore from a backup?

**A:** Yes! Replace the current `budget_tracker.db` with your backup file and restart the app.

### Q: How much data can I store?

**A:** SQLite can handle millions of transactions. For most personal use, you'll never hit the limit.

---

## Technical Questions

### Q: What if I get a "Port 5000 already in use" error?

**A:** Another app is using port 5000. Solutions:

1. **Find and close the conflicting app:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000 | kill -9 <PID>
   ```

2. **Use a different port:**
   Edit `app.py`:
   ```python
   app.run(debug=True, port=5001)  # Use 5001 instead
   ```

### Q: How do I update the dependencies?

**A:** Run:
```bash
pip install --upgrade -r requirements.txt
```

### Q: Can I use PostgreSQL instead of SQLite?

**A:** Yes! Update `app.py`:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/dbname'
```

Install PostgreSQL driver:
```bash
pip install psycopg2-binary
```

### Q: How do I reset the database?

**A:** 
```bash
# 1. Stop the app (Ctrl+C)
# 2. Delete the database file
rm budget_tracker.db
# 3. Restart the app
python app.py
```

---

## Usage Tips

### 💡 Tip 1: Bulk Add Transactions

Want to add last month's transactions quickly?

1. Export to CSV from another source
2. Open the app in multiple tabs
3. Quickly fill in the form for each transaction

### 💡 Tip 2: Use Descriptions Wisely

Add meaningful descriptions:
- ✅ "Grocery shopping - Reliance"
- ✅ "Monthly rent - Apartment A"
- ❌ "Misc"
- ❌ "Money"

This helps when reviewing expenses later!

### 💡 Tip 3: Mark Recurring Expenses

Check the "Recurring Entry" checkbox for:
- Monthly rent/mortgage
- Subscriptions
- Salary
- Insurance premiums

You can then search for recurring entries easily.

### 💡 Tip 4: Review Monthly

Set a reminder to review your budget monthly:
1. Look at the category breakdown
2. Compare with previous months
3. Adjust spending if needed

### 💡 Tip 5: Set Category Limits

Mentally set limits for each category:
- Food: ₹5000/month
- Transport: ₹2000/month
- Entertainment: ₹1500/month

The app will alert you if you exceed ₹5000!

### 💡 Tip 6: Use Dark Mode at Night

Enable dark mode to:
- Reduce eye strain
- Save battery on OLED screens
- Look cooler 😎

### 💡 Tip 7: Export for Analysis

Export to CSV to:
- Create custom reports in Excel
- Analyze spending patterns
- Share with accountant
- Keep archived records

### 💡 Tip 8: Regular Backups

Backup your data monthly:
```bash
# Copy the database
cp budget_tracker.db budget_tracker_backup_2024_01.db
```

### 💡 Tip 9: Use Categories Consistently

Be consistent with categories:
- ✅ Always use "Food" for groceries
- ❌ Don't use both "Food" and "Groceries"

This makes analysis accurate!

### 💡 Tip 10: Date Filtering

Use date range filtering to analyze:
- Weekly spending
- Seasonal trends
- Vacation expenses
- Tax year breakdowns

---

## Feature Questions

### Q: How do I add a custom category?

**A:** Just type in any category name in the form! It'll be added automatically.

### Q: Can I edit a transaction after adding it?

**A:** Yes! Click the pencil icon next to any transaction to edit.

### Q: Can I set spending limits?

**A:** Not automatically, but the app alerts you when category spending exceeds ₹5000. You can adjust this threshold by editing the code.

### Q: Can I see trends over time?

**A:** Yes! The "12-Month Chart" shows income vs. expenses over time.

### Q: Can I filter by date range?

**A:** Not yet! But you can filter by month. We're working on date range filtering.

### Q: Can I add notes to transactions?

**A:** Yes! Use the "Description" field for notes like "With Sarah" or "Online purchase".

### Q: Can I see which transactions are recurring?

**A:** Currently they're just marked with a checkbox. Future versions will show recurring badge.

### Q: Can I group similar transactions?

**A:** No, but you can use categories for grouping (e.g., "Transport - Bus", "Transport - Taxi").

### Q: Can I print my transactions?

**A:** Yes! Use your browser's print function (Ctrl+P or Cmd+P) or export to PDF.

---

## Troubleshooting Tips

### Charts Not Showing?

Try these steps in order:

1. **Hard refresh browser:**
   - Windows: Ctrl+Shift+R
   - macOS: Cmd+Shift+R

2. **Clear cache:**
   - F12 → Application → Clear storage → Reload

3. **Check console for errors:**
   - F12 → Console tab → Look for red errors

4. **Restart the app:**
   ```bash
   # Stop with Ctrl+C
   # Then restart
   python app.py
   ```

### Transactions Not Saving?

1. **Check form validation:**
   - All fields are required
   - Amount must be > 0
   - Date must be valid

2. **Check console:**
   - F12 → Console → Look for API errors

3. **Check server logs:**
   - Terminal running the app → Look for error messages

### Slow Performance?

1. **Restart the app** - Clears memory cache
2. **Close other tabs** - Saves browser resources
3. **Export and archive** - Delete old transactions (after backup!)
4. **Update browser** - Use latest version of Chrome/Firefox

### Can't Connect to localhost:5000?

Try:
1. Make sure the app is running (`python app.py`)
2. Try `http://127.0.0.1:5000` instead
3. Check if another app is using port 5000
4. Restart your computer

---

## Best Practices

### 📋 Best Practice 1: Consistency

Use the same format for all entries:
- Categories: "Transport" not "travel" or "commute"
- Descriptions: "Rent - Feb 2024" not "rent feb 24"
- Amounts: Always positive, type indicates +/-

### 📋 Best Practice 2: Regular Reviews

Schedule monthly reviews:
- Check for unusual expenses
- Update budget targets
- Export for records

### 📋 Best Practice 3: Data Backup

Backup your database:
- Weekly if you add transactions daily
- Monthly at minimum
- Keep 3 months of backups

### 📋 Best Practice 4: Category Limits

Set realistic limits:
- Based on your income
- Account for inflation
- Leave 10% buffer for unexpected expenses

### 📋 Best Practice 5: Honest Tracking

Include ALL expenses:
- Small purchases add up
- Be honest for accurate insights
- Don't skip "minor" expenses

---

## Privacy & Security

### Q: Is my data private?

**A:** Yes! All data stays on your computer. We never collect or send data anywhere.

### Q: Can I share the app with family?

**A:** Yes, but all users see the same data. A future update will add user accounts.

### Q: How do I protect my data?

**A:** 
- Keep backups in secure location
- Don't share your computer password
- Use strong computer password
- Keep Windows/macOS updated

### Q: Can I use this for business?

**A:** Yes, but you might want professional accounting software for compliance.

---

## Performance Tips

### Speed Up the App

1. **Disable auto-refresh:**
   - Comment out the setInterval in script.js

2. **Reduce chart complexity:**
   - Remove unused charts
   - Limit data range

3. **Archive old data:**
   - Export and delete transactions older than 1 year
   - Keeps database smaller

4. **Use Chrome:**
   - Generally faster than Firefox/Safari
   - Better DevTools for debugging

---

## Customization Tips

### Change Colors

Edit `static/css/style.css`:

```css
:root {
    --primary-color: #007bff;      /* Change to your color */
    --income-color: #2ecc71;        /* Green for income */
    --expense-color: #e74c3c;       /* Red for expense */
}
```

### Change Currency

Currently uses ₹ (Indian Rupee).

To change:

1. Edit `templates/index.html`: Replace `₹` with your currency symbol
2. Edit `static/js/script.js`: Update `formatCurrency()` function
3. Update `app.py`: Add currency to responses

### Change Theme Colors

For dark mode customization:

```css
body.dark-mode {
    --bg-primary: #1a1a1a;          /* Darker background */
    --text-primary: #ffffff;         /* Lighter text */
}
```

### Add Your Logo

Replace in `templates/index.html`:

```html
<a class="navbar-brand" href="#">
    <img src="path/to/logo.png" alt="Logo" height="40">
    Budget Tracker
</a>
```

---

## Future Features You Can Add

These features are planned or can be added:

- ✨ **User Authentication** - Multi-user support
- ✨ **Budget Goals** - Set spending targets
- ✨ **Notifications** - Email alerts
- ✨ **Mobile App** - iOS/Android versions
- ✨ **Investments Tracking** - Track investments
- ✨ **Recurring Automation** - Auto-create recurring entries
- ✨ **PDF Reports** - Generate reports
- ✨ **Tax Reports** - Generate tax documents
- ✨ **Multi-Currency** - Support for multiple currencies
- ✨ **Bank Sync** - Connect to bank accounts

See DEVELOPER_GUIDE.md for how to add these!

---

## Need More Help?

1. **Check README.md** - Full documentation
2. **Check QUICKSTART.md** - Quick setup guide
3. **Check DEVELOPER_GUIDE.md** - Code explanation
4. **Check terminal errors** - Error messages are helpful
5. **Check browser console** - F12 → Console tab

---

## Feedback & Suggestions

Have ideas to improve the app?

1. Test the feature locally
2. Check if it's already planned
3. Open an issue on GitHub
4. Contribute the feature yourself!

---

**Hope this helps! Happy budgeting! 💰**
