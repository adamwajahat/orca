const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database(
  path.join(__dirname, 'database', 'robot_analytics.db'),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the SQLite database');
    }
  }
);

// Helper function to run SQL queries
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Helper function to run INSERT queries
const runInsert = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

// POST Endpoints for data insertion

// 1. Insert Real-Time Data
app.post('/api/real-time', async (req, res) => {
  try {
    const { trash_collected, robot_status, latitude, longitude } = req.body;

    // Validate required fields
    if (!robot_status || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO real_time_data (trash_collected, robot_status, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;

    const result = await runInsert(query, [
      trash_collected || 0,
      robot_status,
      latitude,
      longitude
    ]);

    res.status(201).json({
      message: 'Real-time data inserted successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Error inserting real-time data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Insert Cumulative Data
app.post('/api/cumulative', async (req, res) => {
  try {
    const { total_trash_collected, plastic, metal, organic } = req.body;

    // Validate required fields
    if (!total_trash_collected || !plastic || !metal || !organic) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO cumulative_data (total_trash_collected, plastic, metal, organic)
      VALUES (?, ?, ?, ?)
    `;

    const result = await runInsert(query, [
      total_trash_collected,
      plastic,
      metal,
      organic
    ]);

    res.status(201).json({
      message: 'Cumulative data inserted successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Error inserting cumulative data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Insert Performance Metrics
app.post('/api/performance', async (req, res) => {
  try {
    const { efficiency, operational_time } = req.body;

    // Validate required fields
    if (efficiency === undefined || operational_time === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO performance_metrics (efficiency, operational_time)
      VALUES (?, ?)
    `;

    const result = await runInsert(query, [efficiency, operational_time]);

    res.status(201).json({
      message: 'Performance metrics inserted successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Error inserting performance metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Insert Environmental Impact
app.post('/api/environmental-impact', async (req, res) => {
  try {
    const { pollution_reduction, carbon_offset } = req.body;

    // Validate required fields
    if (pollution_reduction === undefined || carbon_offset === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO environmental_impact (pollution_reduction, carbon_offset)
      VALUES (?, ?)
    `;

    const result = await runInsert(query, [pollution_reduction, carbon_offset]);

    res.status(201).json({
      message: 'Environmental impact data inserted successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Error inserting environmental impact data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Endpoints

// 1. Real-Time Data endpoint
app.get('/api/real-time', async (req, res) => {
  try {
    const query = `
      SELECT timestamp, trash_collected, robot_status, latitude, longitude
      FROM real_time_data
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const data = await runQuery(query);
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'No real-time data available' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Cumulative Data endpoint
app.get('/api/cumulative', async (req, res) => {
  try {
    const query = `
      SELECT total_trash_collected, plastic, metal, organic, timestamp
      FROM cumulative_data
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const data = await runQuery(query);
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'No cumulative data available' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error fetching cumulative data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Performance Metrics endpoint
app.get('/api/performance', async (req, res) => {
  try {
    const query = `
      SELECT efficiency, operational_time, timestamp
      FROM performance_metrics
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const data = await runQuery(query);
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'No performance metrics available' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Environmental Impact endpoint
app.get('/api/environmental-impact', async (req, res) => {
  try {
    const query = `
      SELECT pollution_reduction, carbon_offset, timestamp
      FROM environmental_impact
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const data = await runQuery(query);
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'No environmental impact data available' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error fetching environmental impact data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Historical data endpoints for charts

// 5. Historical Real-Time Data
app.get('/api/real-time/history', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const query = `
      SELECT timestamp, trash_collected, robot_status, latitude, longitude
      FROM real_time_data
      WHERE timestamp >= datetime('now', '-' || ? || ' hours')
      ORDER BY timestamp ASC
    `;
    const data = await runQuery(query, [hours]);
    res.json(data);
  } catch (error) {
    console.error('Error fetching historical real-time data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. Historical Performance Data
app.get('/api/performance/history', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const query = `
      SELECT timestamp, efficiency, operational_time
      FROM performance_metrics
      WHERE timestamp >= datetime('now', '-' || ? || ' days')
      ORDER BY timestamp ASC
    `;
    const data = await runQuery(query, [days]);
    res.json(data);
  } catch (error) {
    console.error('Error fetching historical performance data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
}); 