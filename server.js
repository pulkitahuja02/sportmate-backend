import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: CORS
app.use(cors({
  origin: "https://sportmate-frontend.vercel.app", // Frontend domain
  credentials: true // Allow sending cookies with cross-origin requests
}));

// Middleware: Body parser
app.use(express.json());

// Middleware: Sessions
app.use(session({
  secret: "your_super_secret_key", // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       // Must be true if you're on HTTPS (like Render)
    sameSite: "none",   // Required for cross-origin cookies
    maxAge: 1000 * 60 * 60 * 24 // 1 day session
  }
}));

// Routes
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
