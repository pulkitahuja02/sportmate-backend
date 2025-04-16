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

// Sessions middleware
app.use(session({
  secret: "your_super_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // ✅ just for testing (prod me true hi rakhna)
    sameSite: "none",     // ✅ required for cross-origin cookies
    maxAge: 1000 * 60 * 60 * 24
  }
}));
// Routes
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
