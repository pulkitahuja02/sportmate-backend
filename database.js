import pkg from "pg";
const { Pool } = pkg;

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,       // "render"
  host: process.env.DB_HOST,       // "dpg-cva45vt2ng1s73fg04ag-a"
  database: process.env.DB_NAME,   // "sportmate"
  password: process.env.DB_PASSWORD, // "your_actual_password"
  port: process.env.DB_PORT || 5432, // "5432"
});

// Test database connection
pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");

    // Create users table if it doesn't exist
    pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        address TEXT NOT NULL,
        sports TEXT NOT NULL
      )
    `, (err, res) => {
      if (err) {
        console.error("Error creating users table:", err);
      } else {
        console.log("Users table is ready");
      }
    });
  })
  .catch(err => console.error("Error connecting to PostgreSQL:", err));

export default pool;