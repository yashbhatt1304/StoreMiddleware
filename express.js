const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route for the Get Orders
app.get('/orders/:id', async (req, res) => {
  try {
    const fullUrl = req.originalUrl; // Get the full URL
    const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl);
    const data = await response.json();

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
        const response = await fetch('https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/' + fullUrl);
        const data = await response.json();
    
        // Send the fetched data as the response
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching data from external API' });
      }
});

// Start the server on port 3000
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});