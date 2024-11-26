package com.example;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.StringEntity;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import com.google.gson.Gson;

public class PayoutRequest {

    // Method to generate HMAC-SHA256 signature
    public static String generateHMACSHA256Signature(String payload, String secretKey) throws Exception {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        byte[] payloadBytes = payload.getBytes(StandardCharsets.UTF_8);
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hashBytes = mac.doFinal(payloadBytes);

        StringBuilder hashString = new StringBuilder();
        for (byte b : hashBytes) {
            hashString.append(String.format("%02x", b));
        }
        return hashString.toString();
    }

    public static void main(String[] args) {
        try {
            // Endpoint and credentials
            String apiUrl = "https://sandbox.dlocal.com/api_curl/cashout_api/request_cashout";
            String login = "x"; // Replace with actual login
            String transKey = "x"; // Replace with actual transaction key
            String secretKey = "x"; // Replace with actual secret key

            // Payload for the request
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("external_id", "example-id");
            requestBody.put("document_id", "123456789-10");
            requestBody.put("beneficiary_name", "JUAN");
            requestBody.put("beneficiary_lastname", "JUAN");
            requestBody.put("country", "BR");
            requestBody.put("bank_code", "341");
            requestBody.put("bank_branch", "0167");
            requestBody.put("bank_account", "12345-1");
            requestBody.put("account_type", "C");
            requestBody.put("amount", "1100.00");
            requestBody.put("currency", "BRL");
            requestBody.put("type", "json");
            requestBody.put("login", login);
            requestBody.put("pass", transKey);

            // Convert payload to JSON
            Gson gson = new Gson();
            String requestPayloadJSON = gson.toJson(requestBody);

            // Generate the signature
            String signature = generateHMACSHA256Signature(requestPayloadJSON, secretKey);

            // Get the current UTC timestamp
            String timestamp = ZonedDateTime.now(ZoneOffset.UTC)
                    .format(DateTimeFormatter.RFC_1123_DATE_TIME);

            // Prepare and send the HTTP POST request
            CloseableHttpClient httpClient = HttpClients.createDefault();
            HttpPost httpPost = new HttpPost(apiUrl);

            // Set headers
            httpPost.setHeader("X-Date", timestamp);
            httpPost.setHeader("X-Login", login);
            httpPost.setHeader("X-Trans-Key", transKey);
            httpPost.setHeader("payload-signature", signature);

            // Set body
            StringEntity entity = new StringEntity(requestPayloadJSON, ContentType.APPLICATION_JSON);
            httpPost.setEntity(entity);

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                // Read the response
                BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
                StringBuilder responseBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    responseBuilder.append(line);
                }

                // Print the response
                System.out.println("Payment request successful!");
                System.out.println("Response: " + responseBuilder.toString());
            }

        } catch (Exception e) {
            // Handle and log exceptions
            System.err.println("Payment request failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
