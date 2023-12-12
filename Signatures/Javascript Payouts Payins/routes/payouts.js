const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const router = express.Router();

// Function to generate HMAC SHA256 signature
function generateHmacSha256Signature(payload, secretKey) {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(payload);
  return hmac.digest('hex');
}

router.post('/', async (req, res) => {
  const apiURL = 'https://sandbox.dlocal.com/api_curl/cashout_api/request_cashout';
  const timestamp = new Date().toUTCString();
  const login = 'x';
  const transKey = 'x';
  const secretKey = 'x';

  // Extract payload from request body
  const requestBody = req.body;

  // Replace this with your actual request payload
  const requestPayload = {
    login: login,
    pass: transKey,
    ...requestBody
  };

  const requestPayloadJSON = JSON.stringify(requestPayload);
  const signature = generateHmacSha256Signature(requestPayloadJSON, secretKey);

  const headers = {
    'X-Date': timestamp,
    'X-Login': login,
    'X-Trans-Key': transKey,
    'payload-signature': signature,
  };

  try {
    const response = await axios.post(apiURL, requestPayload, { headers });
    console.log('Payment request successful!');
    console.log(`Response: ${JSON.stringify(response.data)}`);
    console.log(`Response Header: ${JSON.stringify(response.headers)}`);
    res.json({ message: 'Payment request successful', response: response.data });
  } catch (error) {
    console.error(`Payment request failed. Error: ${error.message}`);
    res.status(500).json({ error: 'Payment request failed' });
  }
});

module.exports = router;
