package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/google/uuid"
)

func generateHMACSHA256Signature(payload, secretKey string) string {
	keyBytes := []byte(secretKey)
	payloadBytes := []byte(payload)

	hash := hmac.New(sha256.New, keyBytes)
	hash.Write(payloadBytes)
	signature := hash.Sum(nil)

	return fmt.Sprintf("%x", signature)
}

func main() {
	apiURL := "https://sandbox.dlocal.com/api_curl/cashout_api/request_cashout"
	timestamp := time.Now().UTC().Format("2006-01-02T15:04:05Z")
	login := "x"
	transKey := "x"
	secretKey := "x"

	// Generate a random external_id
	externalID := uuid.New().String()

	// Replace this with your actual request payload
	requestPayload := map[string]interface{}{
		"login":                login,
		"pass":                 transKey,
		"external_id":          externalID,
		"document_id":          "12354875",
		"document_type":        "PASS",
		"beneficiary_name":     "JUAN",
		"beneficiary_lastname": "RUIZ",
		"country":              "DO",
		"bank_code":            "1",
		"bank_account":         "1234567891",
		"account_type":         "S",
		"amount":               "119148.00",
		"comments":             "this is the 1st comment",
		"currency":             "DOP",
		"extra_info":           map[string]interface{}{"this_is_extra": 2334},
		"notification_url":     "https://thisisawebsite.net/payments",
		"type":                 "json",
	}

	requestPayloadJSON, err := json.Marshal(requestPayload)
	if err != nil {
		handleError("Error marshaling request payload:", err)
		return
	}

	signature := generateHMACSHA256Signature(string(requestPayloadJSON), secretKey)

	headers := map[string]string{
		"X-Date":            timestamp,
		"X-Login":           login,
		"X-Trans-Key":       transKey,
		"Payload-Signature": signature,
		"Content-Type":      "application/json", // Set Content-Type header
	}

	client := http.Client{}
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(requestPayloadJSON))
	if err != nil {
		handleError("Error creating request:", err)
		return
	}

	for key, value := range headers {
		req.Header.Set(key, value)
	}

	response, err := client.Do(req)
	if err != nil {
		handleError("Error sending request:", err)
		return
	}
	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	responseHeader, err := json.Marshal(response.Header)
	if err != nil {
		handleError("Error reading response body:", err)
		return
	}

	if response.StatusCode == http.StatusOK {
		fmt.Println("Payment request successful!")
		fmt.Println("Response:", string(responseBody))
		fmt.Println("Response Data:", string(responseBody))
		fmt.Println("Response Header:", string(responseHeader))
	} else {
		fmt.Printf("Payment request failed. Status code: %d\n", response.StatusCode)
		fmt.Printf("Response: %s\n", responseBody)
		fmt.Printf("Response Header: %s\n", string(responseHeader))
	}
}

func handleError(message string, err error) {
	fmt.Println(message, err)
}
