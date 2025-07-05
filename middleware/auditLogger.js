// server/middleware/auditLogger.js

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'audit.log');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const auditLogger = (req, res, next) => {
  const user = req.user?.email || 'Guest';
  const timestamp = new Date().toISOString();
  const method = req.method;
  const route = req.originalUrl;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  const logEntry = `[${timestamp}] ${user} | ${method} ${route} | IP: ${ip}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('❌ Failed to write audit log:', err);
    }
  });

  next();
};

module.exports = auditLogger;
