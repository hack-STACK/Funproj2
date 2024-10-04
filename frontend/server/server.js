require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set');
}

const client = twilio(accountSid, authToken);

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
  const { name, date, spot, excitement, imageUrl } = req.body;

  const message = `
    Nama: ${name}
    Tanggal: ${date}
    Spot: ${spot}
    Tingkat Excitement: ${excitement}
    ${imageUrl ? `Image URL: ${imageUrl}` : ''}
  `;

  client.messages
    .create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+6281234047522',
    })
    .then((message) => {
      console.log('Message sent: ', message.sid);
      res.json({ success: true });
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    });
});

// Basic routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the homepage!');
});

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

// Serve static files (if needed)
// app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});