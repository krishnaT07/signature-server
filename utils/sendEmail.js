const nodemailer = require('nodemailer');

/**
 * Send an email using nodemailer.
 *
 * @param {Object} param0
 * @param {string} param0.to - Recipient email address.
 * @param {string} param0.subject - Subject line of the email.
 * @param {string} param0.html - HTML content of the email.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or use host, port, secure for custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"DocuSign Clone" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;

