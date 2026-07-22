import urllib.request
import urllib.parse
import http.cookiejar

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(
    urllib.request.HTTPCookieProcessor(cj),
    urllib.request.HTTPRedirectHandler(),
)

# Register test user
register_data = urllib.parse.urlencode({
    'username': 'verifyuser',
    'email': 'verifyuser@example.com',
    'password': 'Password123!',
    'confirm_password': 'Password123!',
    'full_name': 'Verify User',
    'business_type': 'personal',
}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:5000/register', data=register_data)
with opener.open(req) as r:
    print('register', r.getcode(), r.geturl())

# Login
login_data = urllib.parse.urlencode({
    'username': 'verifyuser',
    'password': 'Password123!',
}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:5000/login', data=login_data)
with opener.open(req) as r:
    print('login', r.getcode(), r.geturl())

# Get Dashboard
req = urllib.request.Request('http://127.0.0.1:5000/dashboard')
with opener.open(req) as r:
    html = r.read().decode('utf-8', 'replace')
    print('dashboard', r.getcode(), r.geturl())
    print('contains dashboard.js:', 'dashboard.js' in html)
    print('contains geminiModal:', 'geminiModal' in html)
    print('last 800 chars:')
    print(html[-800:])
