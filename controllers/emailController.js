const nodemailer = require('nodemailer');

exports.sendShareEmail = async (req, res) => {
  const { email, link } = req.body;

  if (!email || !link) {
    return res.status(400).json({ message: '📧 Email and link are required' });
  }

  try {
    // ✅ Use environment variables for credentials
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
      subject: '📩 Document Share - DocuSign Clone',
      html: `
        <p>Hello,</p>
        <p>You’ve been shared a document for signing.</p>
        <p>
          <a href="${link}" target="_blank" style="color: blue;">Click here to view and sign</a>
        </p>
        <p>This is a secure and time-sensitive link.</p>
        <br />
        <p>Best regards,<br>DocuSign Clone Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${email} [Message ID: ${info.messageId}]`);
    res.status(200).json({ message: '📤 Email sent successfully' });

  } catch (err) {
    console.error('❌ Email send error:', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
};
