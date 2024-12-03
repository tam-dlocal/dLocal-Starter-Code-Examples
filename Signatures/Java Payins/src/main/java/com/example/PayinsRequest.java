package com.example;

import com.google.gson.Gson;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class PayinsRequest {

    public static String generateHMACSHA256Signature(String data, String secretKey) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder hexString = new StringBuilder();
        for (byte b : rawHmac) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }

    public static void main(String[] args) {
        try {
            // API details
            String apiUrl = "https://sandbox.dlocal.com/secure_payments";
            String login = "x"; // Replace with actual login
            String transKey = "x"; // Replace with actual transaction key
            String secretKey = "x"; // Replace with actual secret key

            // Generate UUID for order ID
            String orderId = UUID.randomUUID().toString();

            // Payer details
            Map<String, String> payer = new HashMap<>();
            payer.put("name", "Thiago Gabriel");
            payer.put("email", "thiago@example.com");
            payer.put("document", "07674084973");
            payer.put("user_reference", "12345");

            // Card details
            Map<String, Object> card = new HashMap<>();
            card.put("holder_name", "Thiago Gabriel");
            card.put("number", "4111111111111111");
            card.put("cvv", "123");
            card.put("expiration_month", 10);
            card.put("expiration_year", 2040);

            // Payment request payload
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("amount", 120.00);
            requestPayload.put("currency", "USD");
            requestPayload.put("country", "BR");
            requestPayload.put("payment_method_id", "CARD");
            requestPayload.put("payment_method_flow", "DIRECT");
            requestPayload.put("payer", payer);
            requestPayload.put("card", card);
            requestPayload.put("order_id", orderId);
            requestPayload.put("notification_url", "http://merchant.com/notifications");

            Gson gson = new Gson();
            String payloadJson = gson.toJson(requestPayload);

            // Generate timestamp
            String timestamp = ZonedDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX"));

            // Concatenate data for HMAC signature
            String concatenatedData = login + timestamp + payloadJson;
            String signature = generateHMACSHA256Signature(concatenatedData, secretKey);

            // Prepare HTTP request
            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("X-Date", timestamp);
            connection.setRequestProperty("X-Login", login);
            connection.setRequestProperty("X-Trans-Key", transKey);
            connection.setRequestProperty("Authorization", "V2-HMAC-SHA256, Signature: " + signature);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // Send request payload
            connection.getOutputStream().write(payloadJson.getBytes(StandardCharsets.UTF_8));

            // Read response
            int responseCode = connection.getResponseCode();
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    responseCode == 200 ? connection.getInputStream() : connection.getErrorStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            // Print response
            if (responseCode == 200) {
                System.out.println("Payment request successful!");
                System.out.println("Response: " + response);
            } else {
                System.out.println("Payment request failed. Status code: " + responseCode);
                System.out.println("Response: " + response);
            }

        } catch (Exception e) {
            System.err.println("Error during payment request: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
