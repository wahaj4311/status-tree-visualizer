const express = require('express');
const app = express();
// const port = 3002; // Different port for Service B
const port = process.env.PORT || 3002; // Use environment variable with fallback

// Health check endpoint
app.get('/health', (req, res) => {
  // Let's make this one potentially 'fail' sometimes for demo purposes
  // const isUp = Math.random() > 0.2; // 80% chance of being UP
  // For now, let's keep it simple and always UP
  const isUp = true;
  if (isUp) {
    res.status(200).send({ status: 'UP' });
  } else {
    res.status(503).send({ status: 'DOWN' }); // Service Unavailable
  }
});

app.listen(port, () => {
  console.log(`Service B listening at http://localhost:${port}`);
}); 