const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(
  path.join(__dirname, 'robot_analytics.db'),
  (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to SQLite database');
      initializeTables();
    }
  }
);

// Function to run SQL queries sequentially
const run = (sql) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Initialize all tables
async function initializeTables() {
  try {
    // Create real_time_data table
    await run(`
      CREATE TABLE IF NOT EXISTS real_time_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        trash_collected INTEGER NOT NULL,
        robot_status TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
      )
    `);

    // Create cumulative_data table
    await run(`
      CREATE TABLE IF NOT EXISTS cumulative_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_trash_collected INTEGER NOT NULL,
        plastic INTEGER NOT NULL,
        metal INTEGER NOT NULL,
        organic INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create performance_metrics table
    await run(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        efficiency REAL NOT NULL,
        operational_time INTEGER NOT NULL
      )
    `);

    // Create environmental_impact table
    await run(`
      CREATE TABLE IF NOT EXISTS environmental_impact (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        pollution_reduction INTEGER NOT NULL,
        carbon_offset REAL NOT NULL
      )
    `);

    console.log('All tables created successfully');

    // Insert some sample data for testing
    await insertSampleData();

    console.log('Sample data inserted successfully');
    db.close();
    
  } catch (error) {
    console.error('Error initializing database:', error);
    db.close();
  }
}

// Insert sample data for testing
async function insertSampleData() {
  const sampleData = [
    `INSERT INTO real_time_data (trash_collected, robot_status, latitude, longitude)
     VALUES (25, 'Active', 37.7749, -122.4194)`,
    
    `INSERT INTO cumulative_data (total_trash_collected, plastic, metal, organic)
     VALUES (1000, 600, 300, 100)`,
    
    `INSERT INTO performance_metrics (efficiency, operational_time)
     VALUES (12.5, 480)`,
    
    `INSERT INTO environmental_impact (pollution_reduction, carbon_offset)
     VALUES (1000, 250.5)`
  ];

  for (const query of sampleData) {
    await run(query);
  }
} 