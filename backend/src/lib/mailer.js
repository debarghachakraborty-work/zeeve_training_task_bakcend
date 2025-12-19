import nodemailer from 'nodemailer';

let transporter;

async function createTransporter() {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port:  587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Fallback: create Ethereal account for development/testing
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export const sendOtpEmail = async (to, otp) => {
  if (!transporter) transporter = await createTransporter();

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@example.com';
  const subject = 'Your verification OTP';
  const text = `Your OTP is ${otp}. It will expire in 10 minutes.`;
  const html = `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`;

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    // If using Ethereal, log preview URL
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log('Preview URL:', preview);
    return info;
  } catch (err) {
    console.error('Failed to send OTP email:', err?.message || err);
    throw err;
  }
};

export default async function getTransporter() {
  if (!transporter) transporter = await createTransporter();
  return transporter;
}
