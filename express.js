const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
    //origin: 'http://localhost:3000', // Only allow requests from this origin
    origin: (origin, callback) => {
        if (origin && origin.includes(':3000')) {
          callback(null, true); // Allow requests from any IP with port 3000
        } else {
          callback(new Error('Not allowed by CORS')); // Block all other origins
        }
      }
}

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Route for the Get Orders
app.get('/orders/:id', async (req, res) => {
  try {
    const fullUrl = req.originalUrl; // Get the full URL
    console.log("Recieved getOrderRequest for Id: "+req.params.id)
    const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl);
    const data = await response.json();
    console.log("Parsing the getOrderResponse: "+JSON.stringify(data)+"for Id: "+req.params.id+" ")
    // Send the fetched data as the response
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from external API' });
  }
});

// Route for Get Products
app.get('/products/:id', async (req, res) => {
    try {
        const fullUrl = req.originalUrl; // Get the full URL
        console.log("Recieved getProductRequest for Id: "+req.params.id)
        const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl);
        const data = await response.json();
        console.log("Parsing the getProductResponse: "+JSON.stringify(data)+"for Id: "+req.params.id+" ")
        // Send the fetched data as the response
        res.json(data);
      } catch (error) {
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
    console.log("Recieved createOrderRequest with follwoing details: "+JSON.stringify(req.body))
    // Forward the request to the external API
    const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl, headers);

    // Parse the response from the external API
    const responseData = await response.json();
    console.log("Created Order with following details: "+JSON.stringify(responseData))
    // Send the external API's response back to the original client
    res.json(responseData);
  } catch (error) {
    console.error('Error forwarding data:', error);
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
    console.log("Recieved createProductRequest with follwoing details: "+JSON.stringify(req.body))
    // Forward the request to the external API
    const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl, headers);
    // Parse the response from the external API
    const responseData = await response.json();
    console.log("Created Order with following details: "+JSON.stringify(responseData))

    // Send the external API's response back to the original client
    res.json(responseData);
  } catch (error) {
    console.error('Error forwarding data:', error);
    res.status(500).json({ error: 'Error forwarding data to external API' });
  }
  });

// Start the server on port 3000
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});