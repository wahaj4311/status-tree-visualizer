const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;
const CHECK_INTERVAL = 5000; // Check every 5 seconds

// Debug logging for static file serving
const frontendPath = path.join(__dirname, 'frontend');
console.log('Serving static files from:', frontendPath);
app.use(express.static(frontendPath));

// Add a root route handler for debugging
app.get('/', (req, res) => {
  console.log('Received request for root route');
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Define the microservices to monitor
const services = [
  { name: 'Service A', url: 'http://service-a:3001/health', status: 'UNKNOWN' },
  { name: 'Service B', url: 'http://service-b:3002/health', status: 'UNKNOWN' },
  { name: 'Service C', url: 'http://service-c:3003/health', status: 'UNKNOWN' },
  { name: 'Service D', url: 'http://service-d:3004/health', status: 'UNKNOWN' },
  // Add more services here if needed
];

let serviceStatus = services.map(s => ({ name: s.name, status: s.status }));

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  // Send the current status immediately upon connection
  ws.send(JSON.stringify(serviceStatus));

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Function to broadcast status to all clients
function broadcastStatus() {
  const message = JSON.stringify(serviceStatus);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Function to check service health
async function checkServiceHealth(service) {
  try {
    const response = await axios.get(service.url, { timeout: 2000 }); // 2 second timeout
    if (response.status === 200 && response.data && response.data.status === 'UP') {
      return 'UP';
    }
    return 'DOWN'; // Healthy endpoint but unexpected response
  } catch (error) {
    // console.error(`Error checking ${service.name}:`, error.message);
    return 'DOWN'; // Network error, timeout, non-200 status, etc.
  }
}

// Periodically check all services
setInterval(async () => {
  let changed = false;
  const newStatus = await Promise.all(
    services.map(async (service, index) => {
      const currentStatus = await checkServiceHealth(service);
      if (serviceStatus[index].status !== currentStatus) {
        changed = true;
        console.log(`${service.name} status changed to ${currentStatus}`);
      }
      return { name: service.name, status: currentStatus };
    })
  );

  serviceStatus = newStatus;

  if (changed) {
    broadcastStatus();
  }
}, CHECK_INTERVAL);

// Start the server
server.listen(PORT, () => {
  console.log(`Status Aggregator & Frontend Server listening on port ${PORT}`);
  console.log(`Access the frontend at http://localhost:${PORT}`);
  // Initial check
  Promise.all(services.map(checkServiceHealth)).then(initialStatuses => {
    serviceStatus = services.map((s, i) => ({ name: s.name, status: initialStatuses[i] }));
    console.log('Initial status check complete:', serviceStatus);
    broadcastStatus();
  });
}); 