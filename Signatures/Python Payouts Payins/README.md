# Python Payment Request Project

This Python project is a console application for making a payment request using the dLocal Payouts API. It demonstrates how to generate the required HMAC-SHA256 signature and send a POST request to the API endpoint.

## Prerequisites

Before running this application, make sure you have the following installed:

- [Python](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)

## Getting Started

1. Clone this repository:
```bash
git clone https://github.com/tam-dlocal/dLocal-Starter-Code-Examples.git
cd "dLocal-Starter-Code-Examples/Signatures/Python-Payouts-Payins"
```

2. Open the payment_request.py file and replace the placeholder values for login, transKey, and secretKey with your actual credentials.

3. Install the required dependencies:
```bash
python -m pip install -r requirements.txt
```

4. Run the application:
   
   * Payouts
    ```bash
    python payouts_payment_request.py
    ```

    * Payins
    ```bash
    python payins_payment_request.py
    ```

## Configuration
* api_url: The dLocal Payouts API endpoint.
* login: Your API login.
* trans_key: Your API transaction key.
* secret_key: Your API secret key.

## Features
* Generates a random external_id for each payment request.
* Calculates the HMAC-SHA256 signature for the request payload.
* Sends a POST request to the dLocal Payouts API.
* Displays the response from the API.

## Contributing
If you have improvements or suggestions, feel free to open an issue or create a pull request.

## License
This project is licensed under the MIT License