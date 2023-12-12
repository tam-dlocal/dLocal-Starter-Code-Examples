const express = require('express');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const router = express.Router();

// Create a CSV writer
const csvWriter = createCsvWriter({
  path: './misc/notifications.csv',
  header: [
    { id: 'id', title: 'Payment Id' },
    { id: 'status', title: 'Payment Status' },
    { id: 'payment_method_id', title: 'Payment Method' },
    { id: 'order_id', title: 'Order Id' },
    { id: 'created_date', title: 'Creation Date' },
    { id: 'timestamp', title: 'Updated Date' },
    // Add other fields as needed
  ],
});

// Route for handling notifications
router.post('/', (req, res) => {
  try {
    const notificationPayload = req.body;

    // Implement your logic to process the notification here
    console.log('Received a notification:', notificationPayload);

    // Extract relevant information from the notification payload
    const timestamp = new Date().toISOString();

    const { id, status, payment_method_id, order_id, created_date } = notificationPayload

    // Write the notification to the CSV file
    const record = { id: id, status: status, payment_method_id: payment_method_id, order_id: order_id, created_date: created_date, timestamp: timestamp };
    csvWriter.writeRecords([record]).then(() => {
      console.log('Notification written to CSV file');
    });

    // Respond to the sender, indicating successful processing
    res.json({ message: 'Notification received and stored successfully' });
  } catch (error) {
    console.error('Error processing notification:', error.message);
    res.status(500).json({ error: 'Error processing notification' });
  }
});

module.exports = router;
