const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // adjust for production
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ✅ Audit Logger
const auditLogger = require('./middleware/auditLogger');
app.use(auditLogger);

// ✅ Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/signed', express.static(path.join(__dirname, 'signed')));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/docs', require('./routes/documentRoutes'));
app.use('/api/signatures', require('./routes/signatureRoutes'));
app.use('/api/download', require('./routes/downloadRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/shared', require('./routes/sharedSignRoutes'));


// ✅ Start Server with MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});
