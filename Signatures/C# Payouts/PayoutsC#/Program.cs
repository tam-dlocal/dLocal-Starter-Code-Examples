using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        string apiUrl = "https://sandbox.dlocal.com/api_curl/cashout_api/request_cashout";
        string timestamp = DateTimeOffset.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
        string login = "";
        string transKey = "";
        string secretKey = "";
        
        // Generate a random external_id
        string externalId = Guid.NewGuid().ToString();

        // Replace this with your actual request payload
        string requestPayload = $@"
        {{
            ""login"": ""{login}"",
            ""pass"": ""{transKey}"",
            ""external_id"": ""{externalId}"",
            ""document_id"": ""12354875"",
            ""document_type"": ""PASS"",
            ""beneficiary_name"": ""JUAN"",
            ""beneficiary_lastname"": ""RUIZ"",
            ""country"": ""DO"",
            ""bank_code"": ""1"",
            ""bank_account"": ""1234567891"",
            ""account_type"": ""S"",
            ""amount"": ""119148.00"",
            ""comments"": ""this is the 1st comment"",
            ""currency"": ""DOP"",
            ""extra_info"": ""{{this_is_extra:2334}}"",
            ""notification_url"": ""https://thisisawebsite.net/payments"",
            ""type"": ""json""
        }}";

        string signature = GenerateHMACSHA256Signature(requestPayload, secretKey);

        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("X-Date", timestamp);
            client.DefaultRequestHeaders.Add("X-Login", login);
            client.DefaultRequestHeaders.Add("X-Trans-Key", transKey);
            client.DefaultRequestHeaders.Add("payload-signature", signature);

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
                Console.WriteLine($"Payment request failed. Status code: {response.StatusCode}");
            }
        }
    }

    static string GenerateHMACSHA256Signature(string payload, string secretKey)
    {
        byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);
        byte[] payloadBytes = Encoding.UTF8.GetBytes(payload);

        using (var hmacsha256 = new HMACSHA256(keyBytes))
        {
            byte[] hashBytes = hmacsha256.ComputeHash(payloadBytes);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
