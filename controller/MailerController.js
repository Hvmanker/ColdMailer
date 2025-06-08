// controllers/mailerController.js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const sendMail = async (req, res) => {
  const { email, refreshToken } = req.query;

  if (!email || !refreshToken) {
    return res.status(400).json({ message: 'Missing email or refresh token' });
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const { token: accessToken } = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: email,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken,
        accessToken,
      },
    });

    await transporter.sendMail({
      from: `"Test App" <${email}>`,
      to: 'recipient@example.com',
      subject: '🎉 OAuth Email Test',
      text: 'This email was sent using Gmail OAuth2 from your account!',
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Mail sending error:', err.message);
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
};

module.exports = { sendMail };
