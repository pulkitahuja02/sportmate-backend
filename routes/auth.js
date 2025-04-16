import express from "express";
import pool from "../database.js";
import { sendOTPEmail } from "../services/emailService.js";

const router = express.Router();

// Generate OTP and store in sports column temporarily
router.post("/send-otp", async (req, res) => {
  console.log("send otp auth js me run hogya")
  const { email } = req.body;
  console.log("📩 Received email:", email);
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  console.log("🔢 Generated OTP:", otp);
  const otpData = `OTP:${otp}|${email}`;
  console.log("📦 Prepared otpData for DB:", otpData);

  try {
    // Store OTP in sports column with 5-minute expiry
    console.log("try block me aagya hai code ab auth js ke")
    console.log("Insert query chal rahi hai");
    await pool.query(
      `INSERT INTO emailotp2 (email, otp) VALUES ($1, $2)`,
      [email, otp.toString()]
    );
    console.log("ab hoga sendOTPMail function calll")
    await sendOTPEmail(email, otp);
    res.json({ success: true });
  } catch (err) {
    console.log("catch block me aagya hai ab code")
    console.error("OTP error:", err); // 👈 Yeh line add karna zaroori hai
    res.status(500).json({ error: "OTP send failed" });
  }
});

// Verify OTP during signup
router.post("/signup", async (req, res) => {
  const { name, age, gender, address, sports, username, password } = req.body;

  if (!name || !age || !gender || !address || !sports || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. Insert into users table
    await pool.query(
      `INSERT INTO users (name, age, gender, address, sports)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, age, gender, address, sports]
    );

    // 2. Insert into logindetails table
    await pool.query(
      `INSERT INTO logindetails (username, password)
       VALUES ($1, $2)`,
      [username, password] // In production, hash the password!
    );

    // 3. Insert into myprofile table with default NULL values for avatarlink and status_msg
    await pool.query(
      `INSERT INTO myprofile (username, avatarlink, status_msg)
       VALUES ($1, NULL, NULL)`,
      [username]
    );

    res.json({ success: true, message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

  router.get("/profile", async (req, res) => {
    // Fetch username from session
    const username = req.session.username;  // session se username le rahe hain

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    try {
      // Fetch the user profile from the myprofile table
      const result = await pool.query(
        `SELECT username, avatarlink, status_msg FROM myprofile WHERE username = $1`,
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the profile data
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Profile fetch failed" });
    }
  });



router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM emailotp2 WHERE email = $1 ORDER BY created_at DESC LIMIT 1`,
      [email]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "No OTP found for this email" });
    }

    const latestOTP = rows[0].otp;
    const createdAt = new Date(rows[0].created_at);
    const now = new Date();

    const diffMinutes = Math.floor((now - createdAt) / 1000 / 60); // minutes

    if (diffMinutes > 5) {
      return res.status(410).json({ message: "OTP expired. Please request a new one." });
    }

    if (latestOTP !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ message: "Server error while verifying OTP" });
  }
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM logindetails WHERE username = $1 AND password = $2`,
      [username, password]
    );

    if (rows.length > 0) {
      req.session.username = username; // ✅ Session set
      req.session.save((err) => {     // ✅ Force-save session
        if (err) {
          console.error("Session save error:", err);
          res.status(500).json({ error: "Failed to save session" });
        } else {
          res.json({ success: true });
        }
      });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;