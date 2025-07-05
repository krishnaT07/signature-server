const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ REGISTER Controller
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔎 Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 🔍 Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📝 Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 🛡 Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      msg: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

// ✅ LOGIN Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔎 Input validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // 🔍 Find user with password (because schema has select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🔐 Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // 🛡 Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      msg: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

module.exports = { register, login };


