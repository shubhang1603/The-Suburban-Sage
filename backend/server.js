import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend running successfully" });
});

// Signup route
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword 
    });

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      token,
      message: "Account created successfully"
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({ 
      token,
      message: "Login successful"
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// Protected city route
app.get("/api/city/:name", authenticateToken, async (req, res) => {
  try {
    const city_name = req.params.name;
    const geoResponse = await axios.get(
      `https://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${encodeURIComponent(city_name)}&limit=1`
    );

    const cities = geoResponse?.data?.data;
    if (!Array.isArray(cities) || cities.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const city = cities[0];
    const { latitude, longitude, city: name, country, population } = city;

    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&forecast_days=1`
    );

    const weather = weatherResponse?.data?.current_weather || {};
    res.json({
      city: name,
      latitude,
      longitude,
      country,
      population,
      weather: {
        temperature: weather.temperature ?? null,
        windspeed: weather.windspeed ?? null,
      },
    });
  } catch (error) {
    console.error("City route error:", error?.message || error);
    res.status(500).json({ error: "Error finding city data" });
  }
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
