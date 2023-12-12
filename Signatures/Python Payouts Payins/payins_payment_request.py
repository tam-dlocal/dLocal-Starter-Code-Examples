import requests
import json
import hashlib
import hmac
from datetime import datetime
from uuid import uuid4

def main():
    api_url = "https://sandbox.dlocal.com/secure_payments"
    timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    login = "x"
    trans_key = "x"
    secret_key = "xgit init"

    order_id = str(uuid4())

    # Replace this with your actual request payload
    request_payload = {
        "amount": 120.00,
        "currency": "USD",
        "country": "BR",
        "payment_method_id": "CARD",
        "payment_method_flow": "DIRECT",
        "payer": {
            "name": "Thiago Gabriel",
            "email": "thiago@example.com",
            "document": "07674084973",
            "user_reference": "12345"
        },
        "card": {
            "holder_name": "Thiago Gabriel",
            "number": "4111111111111111",
            "cvv": "123",
            "expiration_month": 10,
            "expiration_year": 2040
        },
        "order_id": order_id,
        "notification_url": "http://merchant.com/notifications"
    }

    body = json.dumps(request_payload)
    concatenated_data = f"{login}{timestamp}{body}"
    key_bytes = secret_key.encode("utf-8")

    hash_bytes = hmac.new(key_bytes, concatenated_data.encode("utf-8"), hashlib.sha256).hexdigest()
    
    headers = {
        "X-Date": timestamp,
        "X-Login": login,
        "X-Trans-Key": trans_key,
        "Authorization": f"V2-HMAC-SHA256, Signature: {hash_bytes}"
    }

    response = requests.post(api_url, json=request_payload, headers=headers)

    if response.status_code == 200:
        print("Payment request successful!")
        print(f"Response: {response.text}")
        print(f"Header: {response.headers}")
    else:
        print(f"Payment request failed. Status code: {response.status_code}")
        print(f"Payment request failed. Response: {response.text}")

if __name__ == "__main__":
    main()
