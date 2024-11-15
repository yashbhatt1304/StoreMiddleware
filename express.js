const express = require('express');
const metricsRouter = require('./metricsRouter');
const logger = require('./logger');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:4000', // Only allow requests from this origin
    // origin: (origin, callback) => {
    //     if (origin && origin.includes(':4000')) {
    //       callback(null, true); // Allow requests from any IP with port 3000
    //     } else {
    //       callback(new Error('Not allowed by CORS')); // Block all other origins
    //     }
    //   }
}

// Middleware to parse JSON bodies
app.use(express.json());

// Use the Custom CORS Configured actions
app.use(cors(corsOptions));

// Use the metrics router
app.use(metricsRouter);

// Log all incoming requests using Loki
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`, { method: req.method, url: req.url });
  next();
});

// Error handling middleware using Loki
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { error: err });
  res.status(500).json({ error: err.message });
});

// Route for the Get Orders
app.get('/orders/:id', async (req, res) => {
  try {
    const fullUrl = req.originalUrl; // Get the full URL
    logger.info("Recieved getOrderRequest for Id: "+req.params.id)
    const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl);
    const data = await response.json();
    logger.info("Parsing the getOrderResponse: "+JSON.stringify(data)+"for Id: "+req.params.id+" ")
    // Send the fetched data as the response
    res.json(data);
  } catch (error) {
    logger.info('Error forwarding data:', error);
    res.status(500).json({ error: 'Error fetching data from external API' });
  }
});

// Route for Get Products
app.get('/products/:id', async (req, res) => {
    try {
        const fullUrl = req.originalUrl; // Get the full URL
        logger.info("Recieved getProductRequest for Id: "+req.params.id)
        const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl);
        const data = await response.json();
        logger.info("Parsing the getProductResponse: "+JSON.stringify(data)+"for Id: "+req.params.id+" ")
        // Send the fetched data as the response
        res.json(data);
      } catch (error) {
        logger.info('Error forwarding data:', error);
        res.status(500).json({ error: 'Error fetching data from external API' });
      }
});

// POST route for Orders
app.post('/orders', async (req, res) => {
  const data = req.body;
  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }

  try {
    const fullUrl = req.originalUrl; // Get the full URL
    logger.info("Recieved createOrderRequest with follwoing details: "+JSON.stringify(req.body))
    // Forward the request to the external API
    const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl, headers);

    // Parse the response from the external API
    const responseData = await response.json();
    logger.info("Created Order with following details: "+JSON.stringify(responseData))
    // Send the external API's response back to the original client
    res.json(responseData);
  } catch (error) {
    logger.info('Error forwarding data:', error);
    res.status(500).json({ error: 'Error forwarding data to external API' });
  }
});

// POST route for Products
app.post('/products', async (req, res) => {
    const data = req.body;
  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }

  try {
    const fullUrl = req.originalUrl; // Get the full URL
    logger.info("Recieved createProductRequest with follwoing details: "+JSON.stringify(req.body))
    // Forward the request to the external API
    const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl, headers);
    // Parse the response from the external API
    const responseData = await response.json();
    logger.info("Created Order with following details: "+JSON.stringify(responseData))

    // Send the external API's response back to the original client
    res.json(responseData);
  } catch (error) {
    logger.info('Error forwarding data:', error);
    res.status(500).json({ error: 'Error forwarding data to external API' });
  }
  });

// Start the server on port 3002
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  logger.info(`Server running on http://localhost:${PORT}`);
});