import pkg from "pg";
const { Pool } = pkg;

// PostgreSQL connection setup
const pool = new Pool({
  user: "your_postgres_user",
  host: "your_postgres_host",
  database: "your_postgres_db",
  password: "your_postgres_password",
  port: 5432, // Default PostgreSQL port
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
