using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        string apiUrl = "https://sandbox.dlocal.com/secure_payments";
        string timestamp = DateTimeOffset.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        string login = "x"; // Replace with your actual login
        string transKey = "x"; // Replace with your actual transKey
        string secretKey = "x"; // Replace with your actual secretKey

        string orderId = Guid.NewGuid().ToString();

        // Replace this with your actual request payload
        string requestPayload = $@"
        {{
            ""amount"": 120.00,
            ""currency"": ""USD"",
            ""country"": ""BR"",
            ""payment_method_id"": ""CARD"",
            ""payment_method_flow"": ""DIRECT"",
            ""payer"": {{
                ""name"": ""Thiago Gabriel"",
                ""email"": ""thiago@example.com"",
                ""document"": ""07674084973"",
                ""user_reference"": ""12345""
            }},
            ""card"": {{
                ""holder_name"": ""Thiago Gabriel"",
                ""number"": ""4111111111111111"",
                ""cvv"": ""123"",
                ""expiration_month"": 10,
                ""expiration_year"": 2040
            }},
            ""order_id"": ""{orderId}"",
            ""notification_url"": ""http://merchant.com/notifications""
        }}";

        string signature = SignatureCalculator(login, timestamp, secretKey, requestPayload);

        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Clear(); // Clear existing headers to avoid conflicts

            client.DefaultRequestHeaders.Add("X-Date", timestamp);
            client.DefaultRequestHeaders.Add("X-Login", login);
            client.DefaultRequestHeaders.Add("X-Trans-Key", transKey);
            client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"V2-HMAC-SHA256, Signature: {signature}");

            var content = new StringContent(requestPayload, Encoding.UTF8, "application/json");
            var response = await client.PostAsync(apiUrl, content);

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Payment request successful!");
                string responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Response: {responseBody}");
                Console.WriteLine($"Header: {response}");
            }
            else
            {
                Console.WriteLine($"Payment request failed. Status code: {response}");
            }
        }
    }

    static string SignatureCalculator(string x_Login, string x_Date, string secretKey, string body)
    {
        string concatenatedData = x_Login + x_Date + body;
        byte[] data = Encoding.UTF8.GetBytes(concatenatedData);
        byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);

        using (var hmacsha256 = new HMACSHA256(keyBytes))
        {
            byte[] hashBytes = hmacsha256.ComputeHash(data);
            StringBuilder signatureBuilder = new StringBuilder();

            foreach (byte b in hashBytes)
            {
                signatureBuilder.Append(b.ToString("x2"));
            }

            return signatureBuilder.ToString();
        }
    }
}
