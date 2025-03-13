import express from "express";
import pool from "../database.js"; // PostgreSQL connection

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, age, gender, address, sports } = req.body;

  if (!name || !age || !gender || !address || !sports) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    INSERT INTO users (name, age, gender, address, sports)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  try {
    const result = await pool.query(query, [name, age, gender, address, sports.join(", ")]);
    res.json({ message: "User created successfully!", id: result.rows[0].id });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Failed to create user." });
  }
});

export default router;
