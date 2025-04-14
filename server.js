import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://sportmate-frontend.vercel.app",  // Allow frontend domain
  credentials: true  // Allow sending cookies/sessions
}));
app.use(express.json()); // ✅ Replaces body-parser, built-in in Express

// Routes
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
