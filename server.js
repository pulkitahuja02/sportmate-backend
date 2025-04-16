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

app.use(session({
  secret: "pullu02020202020202020202020",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Must be true for HTTPS
    sameSite: "none", // Required for cross-site
    httpOnly: true,
    domain: "sportmate-backend-i35i.onrender.com" // ⚠️ Critical for Render
  }
}));
// Routes
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
