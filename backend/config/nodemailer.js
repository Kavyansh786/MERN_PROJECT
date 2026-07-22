const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

const sendOTPEmail = async (to, otp) => {
  // Check if email configuration is available
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration missing. OTP email cannot be sent.');
    console.log('Required environment variables: EMAIL_HOST, EMAIL_USER, EMAIL_PASS');
    throw new Error('Email configuration not set up. Please configure email settings.');
  }

  const mailOptions = {
    from: `"Auréa" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Your OTP for Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Email Verification</h2>
        <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
        <h1 style="color: #4A90E2;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    console.log(`📧 Attempting to send OTP email to: ${to}`);
    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    console.error('Email configuration check:');
    console.error('- EMAIL_HOST:', process.env.EMAIL_HOST ? '✓ Set' : '✗ Missing');
    console.error('- EMAIL_PORT:', process.env.EMAIL_PORT ? '✓ Set' : '✗ Missing');
    console.error('- EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
    console.error('- EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing');
    throw new Error('Could not send OTP email: ' + error.message);
  }
};

module.exports = { sendOTPEmail };
