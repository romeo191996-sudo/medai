import requests

url = "http://127.0.0.1:8000/api/search"
payload = {
    "medicine_name": "Penicillin",
    "language": "en"
}

print("Sending request to FastAPI...")
try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")