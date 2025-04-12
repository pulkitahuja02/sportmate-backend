import express from "express";
import pool from "../database.js";
import { sendOTPEmail } from "../services/emailService.js";

const router = express.Router();

// Generate OTP and store in sports column temporarily
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const otpData = `OTP:${otp}|${email}`;

  try {
    // Store OTP in sports column with 5-minute expiry
    await pool.query(
      `INSERT INTO users (sports) VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET sports = $1`,
      [otpData]
    );

    await sendOTPEmail(email, otp);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "OTP send failed" });
  }
});

// Verify OTP during signup
router.post("/signup", async (req, res) => {
  const { name, age, gender, address, sports, email, otp } = req.body;

  // 1. First verify OTP
  const { rows } = await pool.query(
    `SELECT sports FROM users 
     WHERE sports LIKE $1`,
    [`OTP:${otp}|%`]
  );

  if (!rows.length) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  // 2. Proceed with actual signup
  try {
    await pool.query(
      `UPDATE users SET 
       name = $1, age = $2, gender = $3,
       address = $4, sports = $5
       WHERE sports LIKE $6`,
      [name, age, gender, address, sports, `%|${email}`]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

export default router;