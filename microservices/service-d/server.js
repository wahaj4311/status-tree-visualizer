const express = require('express');
const app = express();
const port = 3004; // Different port for Service D

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
  console.log(`Service D listening at http://localhost:${port}`);
}); 