import requests
import json
import hashlib
import hmac
import datetime
import uuid

def generate_hmac_sha256_signature(payload, secret_key):
    key_bytes = bytes(secret_key, 'utf-8')
    payload_bytes = bytes(payload, 'utf-8')

    signature = hmac.new(key_bytes, payload_bytes, hashlib.sha256).hexdigest()
    return signature

def main():
    api_url = "https://sandbox.dlocal.com/api_curl/cashout_api/request_cashout"
    timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    login = "userco"
    trans_key = "passco"
    secret_key = "secretco"

    # Generate a random external_id
    external_id = str(uuid.uuid4())

    # Replace this with your actual request payload
    request_payload = {
        "login": login,
        "pass": trans_key,
        "external_id": external_id,
        "document_id": "12354875",
        "document_type": "PASS",
        "beneficiary_name": "JUAN",
        "beneficiary_lastname": "RUIZ",
        "country": "DO",
        "bank_code": "1",
        "bank_account": "1234567891",
        "account_type": "S",
        "amount": "119148.00",
        "comments": "this is the 1st comment",
        "currency": "DOP",
        "extra_info": {"this_is_extra": 2334},
        "notification_url": "https://thisisawebsite.net/payments",
        "type": "json"
    }

    request_payload_json = json.dumps(request_payload)
    signature = generate_hmac_sha256_signature(request_payload_json, secret_key)

    headers = {
        "X-Date": timestamp,
        "X-Login": login,
        "X-Trans-Key": trans_key,
        "payload-signature": signature
    }

    response = requests.post(api_url, json=request_payload, headers=headers)

    if response.status_code == 200:
        print("Payment request successful!")
        print(f"Response: {response.text}")
        print(f"Response Data: {response.json()}")
        print(f"Response Header: {response.headers}")
    else:
        print(f"Payment request failed. Status code: {response.status_code}")

if __name__ == "__main__":
    main()
