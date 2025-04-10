const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Use verbose mode for more detailed logs
const path = require('path');

const app = express();
const port = 3001;
const dbPath = path.resolve(__dirname, 'service_a.db'); // Database file in the service-a directory

// Initialize and connect to the database
// This will create the file if it doesn't exist
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS health_checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table "health_checks" is ready.');
      }
    });
  }
});

// Health check endpoint - now checks DB connection
app.get('/health', (req, res) => {
  // Attempt a quick DB write operation
  db.run(`INSERT INTO health_checks (timestamp) VALUES (datetime('now'))`, function(err) {
    if (err) {
      console.error('Database write failed during health check:', err.message);
      // If DB write fails, report the service as DOWN
      res.status(503).send({ status: 'DOWN', reason: 'Database unavailable' });
    } else {
      // If DB write succeeds, report UP
      console.log(`Health check DB write successful, row id: ${this.lastID}`);
      res.status(200).send({ status: 'UP' });
    }
  });
});

app.listen(port, () => {
  console.log(`Service A (with DB) listening at http://localhost:${port}`);
});

// Graceful shutdown - close the database connection
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
}); 