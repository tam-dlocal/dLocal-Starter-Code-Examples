const express = require('express');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

const router = express.Router();

// Function to generate HMAC SHA256 signature
function generateHmacSha256Signature(payload, secretKey) {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(payload);
  return hmac.digest('hex');
}

const sslOptions = {
  key: fs.readFileSync('./misc/private-key.pem'),
  cert: fs.readFileSync('./misc/server.crt.pem'),
};

router.post('/', async (req, res) => {
  const apiURL = 'https://api-certs.dlocal.com/payments-methods?country';
  const timestamp = new Date().toISOString();
  const login = 'x';
  const transKey = 'x';
  const secretKey = 'x';
  // Replace this with your actual request payload
  const requestPayload = req.body;

  const concatenatedData = `${login}${timestamp}`;
  const keyBytes = Buffer.from(secretKey, 'utf-8');

  const hashBytes = generateHmacSha256Signature(concatenatedData, keyBytes);

  const headers = {
    'X-Date': timestamp,
    'X-Login': login,
    'X-Trans-Key': transKey,
    Authorization: `V2-HMAC-SHA256, Signature: ${hashBytes}`,
  };

  const agent = new https.Agent({
    key: sslOptions.key,
    cert: sslOptions.cert
  });

  try {
    const response = await axios.get(`${apiURL}=${requestPayload.country}`, { headers, httpsAgent: agent });
    console.log(`Response: ${JSON.stringify(response.data)}`);
    console.log(`Header: ${JSON.stringify(response.headers)}`);
    res.json({ message: 'Payment request successful', response: response.data });
  } catch (error) {
    console.error(`Payment request failed. Headers: ${error.response.headers}`);
    console.error(`Payment request failed. Message: ${error}`);
    res.status(500).json({ error: `Payment request failed. Error: ${error.response.data.message}` });
  }
});

module.exports = router;
