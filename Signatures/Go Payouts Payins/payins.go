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

type Payer struct {
	Name          string `json:"name"`
	Email         string `json:"email"`
	Document      string `json:"document"`
	UserReference string `json:"user_reference"`
}

type Card struct {
	HolderName      string `json:"holder_name"`
	Number          string `json:"number"`
	CVV             string `json:"cvv"`
	ExpirationMonth int    `json:"expiration_month"`
	ExpirationYear  int    `json:"expiration_year"`
}

func main() {
	apiURL := "https://sandbox.dlocal.com/secure_payments"
	timestamp := time.Now().UTC().Format("2006-01-02T15:04:05.999Z")
	login := "x"
	transKey := "x"
	secretKey := "x"

	orderID := uuid.New()

	payer := Payer{
		Name:          "Thiago Gabriel",
		Email:         "thiago@example.com",
		Document:      "07674084973",
		UserReference: "12345",
	}

	card := Card{
		HolderName:      "Thiago Gabriel",
		Number:          "4111111111111111",
		CVV:             "123",
		ExpirationMonth: 10,
		ExpirationYear:  2040,
	}

	requestPayload := map[string]interface{}{
		"amount":            120.00,
		"currency":          "USD",
		"country":           "BR",
		"payment_method_id": "CARD",
		"payment_method_flow": "DIRECT",
		"payer":             payer,
		"card":              card,
		"order_id":          orderID,
		"notification_url": "http://merchant.com/notifications",
	}

	body, err := json.Marshal(requestPayload)
	if err != nil {
		handleError("Error marshaling request payload:", err)
		return
	}

	concatenatedData := fmt.Sprintf("%s%s%s", login, timestamp, body)
	keyBytes := []byte(secretKey)
	hashBytes := hmac.New(sha256.New, keyBytes)
	hashBytes.Write([]byte(concatenatedData))
	signature := hashBytes.Sum(nil)

	headers := map[string]string{
		"X-Date":        timestamp,
		"X-Login":       login,
		"X-Trans-Key":   transKey,
		"Authorization": fmt.Sprintf("V2-HMAC-SHA256, Signature: %x", signature),
		"Content-Type":  "application/json", // Set Content-Type header
	}

	fmt.Println("requestPayload")
	fmt.Println(requestPayload)

	client := http.Client{}
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(body))
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
		fmt.Println("Header:", string(responseHeader))
	} else {
		fmt.Printf("Payment request failed. Status code: %d\n", response.StatusCode)
		fmt.Printf("Response: %s\n", responseBody)
		fmt.Printf("Response Header: %s\n", string(responseHeader))
	}
}

func handleError(message string, err error) {
	fmt.Println(message, err)
}
