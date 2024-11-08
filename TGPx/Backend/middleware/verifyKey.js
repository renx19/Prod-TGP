// middleware/verifyApiKey.js
require('dotenv').config();

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  console.log('Received API key:', apiKey); // Log the received API key
  console.log('Valid API key:', validApiKey); // Log the valid API key

  if (apiKey && apiKey === validApiKey) {
    next(); // API key is valid, proceed to the next middleware or route handler
  } else {
    console.error('Invalid API key'); // Log invalid API key attempt
    res.status(401).json({ error: 'Unauthorized. Invalid or missing API key.' });
  }
};


module.exports = verifyApiKey;
  