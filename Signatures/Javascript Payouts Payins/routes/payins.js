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
  const apiURL = 'https://sandbox.dlocal.com/secure_payments';
  const timestamp = new Date().toISOString();
  const login = 'x';
  const transKey = 'x';
  const secretKey = 'x';
  // Replace this with your actual request payload
  const requestPayload = req.body

  const body = JSON.stringify(requestPayload);
  const concatenatedData = `${login}${timestamp}${body}`;
  const keyBytes = Buffer.from(secretKey, 'utf-8');

  const hashBytes = generateHmacSha256Signature(concatenatedData, keyBytes);

  const headers = {
    'X-Date': timestamp,
    'X-Login': login,
    'X-Trans-Key': transKey,
    Authorization: `V2-HMAC-SHA256, Signature: ${hashBytes}`,
  };

  try {
    const response = await axios.post(apiURL, requestPayload, { headers });
    console.log(`Response: ${JSON.stringify(response.data)}`);
    console.log(`Header: ${JSON.stringify(response.headers)}`);
    res.json({ message: 'Payment request successful', response: response.data });
  } catch (error) {
    console.error(`Payment request failed. Headers: ${error.response.headers}`);
    console.error(`Payment request failed. Message: ${error.response.data.message}`);
    res.status(500).json({ error: `Payment request failed. Error: ${error.response.data.message}` });
  }
});

module.exports = router;
