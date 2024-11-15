const express = require('express');
const promClient = require('prom-client');

const router = express.Router();

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics(); // Collect default metrics like memory usage, CPU, etc.

// Custom metrics for your Express application
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5], // Define buckets for response times
});

// Middleware to record metrics for all routes
router.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  // Listen for when the response is finished
  res.on('finish', () => {
    // Increment the request counter
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();

    // Record the duration of the request
    end({ method: req.method, route: req.path, status: res.statusCode });
  });

  next();
});

// Route to expose metrics to Prometheus
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

module.exports = router;