const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// ✅ Allowed Frontend Origins (Local + Deployed)
const allowedOrigins = [
  'http://localhost:3000',
  'https://signature-client-ashy.vercel.app',
];

// ✅ CORS Setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ✅ Middleware: Audit Logger
const auditLogger = require('./middleware/auditLogger');
app.use(auditLogger);

// ✅ Static File Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/signed', express.static(path.join(__dirname, 'signed')));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/docs', require('./routes/documentRoutes'));
app.use('/api/signatures', require('./routes/signatureRoutes'));
app.use('/api/download', require('./routes/downloadRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/shared', require('./routes/sharedSignRoutes'));

// ✅ MongoDB Connection & Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

