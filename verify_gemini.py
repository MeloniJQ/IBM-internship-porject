import urllib.request
import urllib.parse
import http.cookiejar
import json

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(
    urllib.request.HTTPCookieProcessor(cj),
    urllib.request.HTTPRedirectHandler(),
)

# Try registering a test user
try:
    data = urllib.parse.urlencode({
        'username': 'geminiuser',
        'email': 'geminiuser@example.com',
        'password': 'Password123!',
        'confirm_password': 'Password123!',
        'full_name': 'Gemini User',
        'business_type': 'personal',
    }).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:5000/register', data=data)
    with opener.open(req) as r:
        print('register', r.getcode(), r.geturl())
except Exception as e:
    print('register failed', e)

# Login with the test user
login_data = urllib.parse.urlencode({
    'username': 'geminiuser',
    'password': 'Password123!',
}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:5000/login', data=login_data)
req.add_header('Content-Type', 'application/x-www-form-urlencoded')
with opener.open(req) as r:
    print('login', r.getcode(), r.geturl())

# Call Gemini endpoint
payload = json.dumps({'prompt': 'Hello from test'}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:5000/api/gemini', data=payload)
req.add_header('Content-Type', 'application/json')
with opener.open(req) as r:
    print('api/gemini', r.getcode(), r.geturl())
    print(r.read().decode('utf-8', 'replace'))
