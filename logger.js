const winston = require('winston');
const LokiTransport = require('winston-loki'); // Import Loki transport directly

const logger = winston.createLogger({
    transports: [
        new LokiTransport({
          host: process.env.LOKI_HOST || 'http://localhost:3100',
          labels: { job: 'express-app' },
          json: true,
          format: winston.format.json(),
        })
      ],
});

module.exports = logger;