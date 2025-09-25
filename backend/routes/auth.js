import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, standard, stream, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, Email, and Password are required" });
    }

    // Default role = student
    const userRole = role || "student";

    // Students must provide standard; stream required only for 11 & 12
    if (userRole === "student") {
      if (!standard) {
        return res.status(400).json({ msg: "Standard is required for students" });
      }
      if ((standard === "11" || standard === "12") && !stream) {
        return res.status(400).json({ msg: "Stream is required for classes 11 and 12" });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      standard: userRole === "student" ? standard : "N/A",
      stream: userRole === "student" ? (stream || "N/A") : "N/A",
      role: userRole,
    });

    await user.save();

    console.log("✅ User registered:", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      msg: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        standard: user.standard,
        stream: user.stream,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      standard: user.standard,
      stream: user.stream,
      role: user.role,
    };

    console.log("✅ User logged in:", userData);

    res.status(200).json({
      msg: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
});

export default router;
