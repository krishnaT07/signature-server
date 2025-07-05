// server/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const ShareToken = require('../models/ShareToken');

// POST /api/email/share
router.post('/share', async (req, res) => {
  const { email, link } = req.body;

  if (!email || !link) {
    return res.status(400).json({ error: 'Email and link are required' });
  }

  try {
    const documentId = link.split('/').pop();
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    await ShareToken.create({ documentId, token, used: false, expiresAt });

    const shareLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/shared/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DocuSign Clone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '📄 Document Signature Request',
      html: `
        <p>Hello,</p>
        <p>You have been invited to sign a document.</p>
        <p><strong>Click the link below to view and sign:</strong></p>
        <a href="${shareLink}" target="_blank">${shareLink}</a>
        <p>This link is valid for 1 hour and can only be used once.</p>
        <br/>
        <p>Regards,<br/>DocuSign Clone</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('SendMail Error:', err);
        return res.status(500).json({ error: 'Failed to send email' });
      }
      console.log(`✅ Email sent to ${email} with link: ${shareLink}`);
      res.status(200).json({ message: 'Email sent successfully' });
    });

  } catch (err) {
    console.error('Email share error:', err);
    res.status(500).json({ error: 'Failed to process email share request' });
  }
});

module.exports = router;
