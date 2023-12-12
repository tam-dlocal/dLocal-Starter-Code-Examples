// Import the Express framework
const express = require('express');

// Import custom route modules
const payoutsRoute = require('./routes/payouts');
const payinsRoute = require('./routes/payins');
const payinsCertificateAuthRoute = require('./routes/payins-certificate-auth');
const payinsCertificateAuthRouteGetPaymentMethods = require('./routes/payins-certificate-auth-get-payments');
const notificationsRoute = require('./routes/notifications');

// Create an instance of the Express application
const app = express();
const PORT = 3000; // Set the port for the server (you can use any port you prefer)

// Middleware to parse JSON in request bodies
app.use(express.json());

// Use the defined routes for specific functionalities

// Route for managing payouts
app.use('/payouts', payoutsRoute);

// Route for managing pay-ins
app.use('/payins', payinsRoute);

// Route for certificate-authenticated pay-ins with payment method retrieval
app.use('/payins-certificate-auth-get-payments', payinsCertificateAuthRouteGetPaymentMethods);

// Route for certificate-authenticated pay-ins
app.use('/payins-certificate-auth', payinsCertificateAuthRoute);

// Route for handling notifications
app.use('/notifications', notificationsRoute);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
