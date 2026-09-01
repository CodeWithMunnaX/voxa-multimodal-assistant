import urllib.request
import urllib.parse
import urllib.error

req = urllib.request.Request(
    'http://localhost:8000/api/auth/login',
    data=urllib.parse.urlencode({'username':'test@gmail.com','password':'wrongpassword'}).encode(),
    headers={'Origin': 'http://localhost:3000'}
)

try:
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    print(e.headers)
