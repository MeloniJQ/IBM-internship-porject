# 🌐 Deployment Guide

Learn how to deploy your Budget Tracker to production servers.

---

## Table of Contents

1. [Local Network Deployment](#local-network-deployment)
2. [Heroku Deployment](#heroku-deployment)
3. [PythonAnywhere Deployment](#pythonanywhere-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Production Checklist](#production-checklist)

---

## Local Network Deployment

Run the app on your local network so other devices can access it.

### Step 1: Find Your IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

**macOS/Linux:**
```bash
ifconfig
# Look for "inet" address (e.g., 192.168.1.100)
```

### Step 2: Update Flask Configuration

Edit `app.py` (last lines):

```python
if __name__ == '__main__':
    app.run(
        debug=True,
        host='0.0.0.0',  # Listen on all network interfaces
        port=5000
    )
```

### Step 3: Run the App

```bash
python app.py
```

### Step 4: Access from Other Devices

On another device on the same network, visit:
```
http://YOUR_IP_ADDRESS:5000
# Example: http://192.168.1.100:5000
```

---

## Heroku Deployment

Deploy for free (with limitations) on Heroku.

### Step 1: Create Heroku Account

Visit [heroku.com](https://www.heroku.com/) and sign up.

### Step 2: Install Heroku CLI

Download from [heroku.com/download](https://devcenter.heroku.com/articles/heroku-cli)

### Step 3: Create `Procfile`

In project root, create `Procfile`:

```
web: gunicorn app:app
```

### Step 4: Update `requirements.txt`

Add Gunicorn:

```bash
pip install gunicorn
pip freeze > requirements.txt
```

**File should contain:**
```
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
SQLAlchemy==2.0.21
Werkzeug==2.3.7
python-dotenv==1.0.0
gunicorn==21.2.0
```

### Step 5: Update `app.py`

```python
import os

# Production database
if os.environ.get('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget_tracker.db'

# Production settings
app.config['DEBUG'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key')
```

### Step 6: Deploy

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set secret key
heroku config:set SECRET_KEY=your-secret-key-here

# Deploy
git push heroku main  # or master

# Initialize database
heroku run python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Open app
heroku open
```

### Viewing Logs

```bash
heroku logs --tail
```

---

## PythonAnywhere Deployment

Easy Python hosting platform.

### Step 1: Create Account

Visit [pythonanywhere.com](https://www.pythonanywhere.com/) and sign up.

### Step 2: Upload Files

1. Go to "Files" tab
2. Upload your project folder

### Step 3: Create Web App

1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Python" and your version
4. Choose "Flask" framework

### Step 4: Configure WSGI

Edit the WSGI configuration file:

```python
import sys
import os

path = '/home/yourusername/budget-tracker'
sys.path.append(path)

os.chdir(path)

from app import app
application = app
```

### Step 5: Set Environment Variables

In Web app configuration, add:

```
DEBUG = False
SECRET_KEY = your-secret-key-here
DATABASE_URL = sqlite:///home/yourusername/budget-tracker/budget_tracker.db
```

### Step 6: Reload Web App

Click the green "Reload" button on the Web tab.

Your app is live at: `https://yourusername.pythonanywhere.com`

---

## AWS Deployment

Deploy on Amazon Web Services.

### Using Elastic Beanstalk

#### Step 1: Install EB CLI

```bash
pip install awsebcli --upgrade --user
```

#### Step 2: Create `.ebextensions/` Directory

```
.ebextensions/
├── 01_flask.config
└── 02_python.config
```

**01_flask.config:**
```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: app:app
  aws:autoscaling:launchconfiguration:
    InstanceType: t2.micro
```

#### Step 3: Create Procfile

```
web: gunicorn --workers=1 --threads=2 --timeout=60 --access-logfile - --error-logfile - app:app
```

#### Step 4: Initialize EB

```bash
eb init -p python-3.11 budget-tracker --region us-east-1
```

#### Step 5: Create Environment

```bash
eb create budget-tracker-env
```

#### Step 6: Deploy

```bash
eb deploy

# View logs
eb logs

# Monitor
eb open
```

---

## Docker Deployment

Deploy using Docker containers.

### Step 1: Create `Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 5000

# Set environment
ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

### Step 2: Create `.dockerignore`

```
venv/
__pycache__/
*.pyc
.env
.git
.gitignore
README.md
```

### Step 3: Build Image

```bash
docker build -t budget-tracker:latest .
```

### Step 4: Run Container

```bash
docker run -p 5000:5000 -e SECRET_KEY=your-key budget-tracker:latest
```

Visit: `http://localhost:5000`

### Step 5: Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=your-secret-key
    volumes:
      - ./budget_tracker.db:/app/budget_tracker.db
    restart: unless-stopped
```

Run with:
```bash
docker-compose up
```

---

## Production Checklist

### Security

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `FLASK_ENV=production`
- [ ] Set `DEBUG=False`
- [ ] Use HTTPS/SSL certificate
- [ ] Enable CORS only for trusted domains
- [ ] Set strong database passwords
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable security headers
- [ ] Set up rate limiting
- [ ] Use WSGI server (Gunicorn, uWSGI)

### Performance

- [ ] Enable caching (browser & server)
- [ ] Minify CSS and JavaScript
- [ ] Compress assets (gzip)
- [ ] Optimize database queries
- [ ] Use CDN for static files
- [ ] Enable query profiling
- [ ] Monitor server resources
- [ ] Set up auto-scaling

### Monitoring & Logging

- [ ] Set up error logging (Sentry, New Relic)
- [ ] Monitor application performance (APM)
- [ ] Track user behavior (Analytics)
- [ ] Set up health checks
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Monitor server uptime
- [ ] Set up alerts for errors

### Backup & Recovery

- [ ] Automated daily database backups
- [ ] Test backup restoration
- [ ] Store backups in multiple locations
- [ ] Document recovery procedures
- [ ] Version control all code
- [ ] Tag release versions

### Maintenance

- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities
- [ ] Regular security audits
- [ ] Performance optimization reviews
- [ ] User feedback monitoring
- [ ] Documentation updates

---

## Environment-Specific Configuration

### Development

```env
FLASK_ENV=development
DEBUG=True
SQLALCHEMY_ECHO=True
```

### Staging

```env
FLASK_ENV=staging
DEBUG=False
TESTING=False
```

### Production

```env
FLASK_ENV=production
DEBUG=False
SECRET_KEY=strong-random-key
DATABASE_URL=postgresql://...
```

---

## Common Deployment Issues

### Issue: Static Files Not Loading

**Solution:** Use WhiteNoise middleware

```bash
pip install whitenoise
```

In `app.py`:
```python
from whitenoise import WhiteNoise
app.wsgi_app = WhiteNoise(app.wsgi_app, root='static/')
```

### Issue: Database Not Persisting

**Solution:** Use PostgreSQL or ensure SQLite path is absolute

```python
import os
db_path = os.path.abspath('budget_tracker.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
```

### Issue: 502 Bad Gateway

**Solution:** Check server logs and increase timeout

```bash
gunicorn --timeout 120 app:app
```

### Issue: Out of Memory

**Solution:** Limit worker processes

```bash
gunicorn --workers 2 --threads 4 app:app
```

---

## Monitoring & Uptime

### Using UptimeRobot (Free)

1. Create account at [uptimerobot.com](https://uptimerobot.com/)
2. Add monitor for your app URL
3. Get email alerts if app goes down

### Using Sentry (Error Tracking)

```bash
pip install sentry-sdk
```

In `app.py`:
```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()]
)
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Update Flask

```python
from flask_talisman import Talisman

Talisman(app, force_https=True)
```

---

## Quick Deploy Command Cheat Sheet

```bash
# Heroku
git push heroku main

# AWS EB
eb deploy

# Docker
docker build -t app . && docker run -p 5000:5000 app

# PythonAnywhere
# Use web interface to reload

# Direct Server
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## Support & Help

- Heroku Docs: https://devcenter.heroku.com/
- PythonAnywhere: https://help.pythonanywhere.com/
- AWS Documentation: https://docs.aws.amazon.com/
- Docker Docs: https://docs.docker.com/

---

**Choose the deployment option that best fits your needs! 🚀**
