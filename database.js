import pkg from "pg";
const { Pool } = pkg;

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,       
  host: process.env.DB_HOST,       
  database: process.env.DB_NAME,   
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT || 5432, 
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

    // Create email table if it doesn't exist
    pool.query(`
     CREATE TABLE IF NOT EXISTS emailotp2 (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      otp TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `, (err, res) => {
      if (err) {
        console.error("Error creating email table:", err);
      } else {
        console.log("Email table is ready");
      }
    });

    // Create logindetails table if it doesn't exist
    pool.query(`
      CREATE TABLE IF NOT EXISTS logindetails (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `, (err, res) => {
      if (err) {
        console.error("Error creating logindetails table:", err);
      } else {
        console.log("LoginDetails table is ready");
      }
    })
  })
  .catch(err => console.error("Error connecting to PostgreSQL:", err));

export default pool;
