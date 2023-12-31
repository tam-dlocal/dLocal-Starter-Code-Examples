# Go Payouts & Payins

This repository contains two Go projects, Payins and Payouts, that demonstrate integration with the dLocal API for secure payments and cashout requests.

## Payins

The Payins project showcases how to initiate a payment request using the dLocal API.

### Usage

1. Set up Go environment on your machine.
2. Clone the repository:

   ```bash
    git clone https://github.com/tam-dlocal/dLocal-Starter-Code-Examples.git
   ```

3. Navigate to the root directory:

    ```bash
    cd "dLocal-Starter-Code-Examples/Signatures/Go Payouts Payins"
    ```

4. Update the payins.go file with your dLocal sandbox credentials and payment details.

5. Run the Payins project:

    ```bash
    go run payins.go
    ```

##  Payouts
The Payouts project demonstrates how to make a cashout request using the dLocal API.

##  Usage
1. Set up Go environment on your machine.

2. Clone the repository:

    ```bash
    git clone https://github.com/hlatki01/Go-Payouts-Payins.git
    ```

3. Navigate to the root directory:

    ```bash
    cd Go-Payouts-Payins
    ```

4. Update the payouts.go file with your dLocal sandbox credentials and cashout details.

5. Run the Payouts project:

    ```bash
    go run payouts.go
    ```

## Configuration
* apiURL: The dLocal Payouts API endpoint.
* login: Your API login.
* transKey: Your API transaction key.
* secretKey: Your API secret key.

## Features
* Generates a random externalID for each payment request for Payouts and a orderID for Payins.
* Calculates the HMAC-SHA256 signature for the request payload.
* Sends a POST request to the dLocal Payouts/Payins API.
* Displays the response from the API.

## Contributing
If you have improvements or suggestions, feel free to open an issue or create a pull request.

## License
This project is licensed under the MIT License