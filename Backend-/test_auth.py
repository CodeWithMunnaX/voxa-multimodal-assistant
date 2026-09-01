import requests

# test register
print("Registering...")
r1 = requests.post("http://localhost:8000/api/auth/register", json={
    "email": "test4@example.com",
    "username": "testuser4",
    "password": "password123"
})
print(f"Register status: {r1.status_code}, response: {r1.text}")

# test login
print("\nLogging in...")
r2 = requests.post("http://localhost:8000/api/auth/login", json={
    "email": "test4@example.com",
    "password": "password123"
})
print(f"Login status: {r2.status_code}, response: {r2.text}")
