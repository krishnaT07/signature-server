// middleware/protect.js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🛡️ Auth Header:", authHeader);

    // 🛡️ Ensure the token is present and well-formed
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided. Access denied." });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request for later use
    req.user = decoded;

    next(); // 🚀 Continue to next middleware/route
  } catch (err) {
    console.error("❌ JWT Error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ msg: "Token has expired. Please log in again." });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ msg: "Invalid token." });
    }

    return res.status(500).json({ msg: "Token verification failed", error: err.message });
  }
};

module.exports = protect;
