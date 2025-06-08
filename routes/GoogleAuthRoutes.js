// routes/googleAuth.js
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1: Redirect user to Google's consent screen
router.get('/auth/google', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/gmail.send',
    ],
  });
  res.redirect(url);
});

// Step 2: Handle the OAuth callback and extract tokens + email
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();

    // You could save these tokens for later
    const userInfo = {
      email: data.email,
      name: data.name,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };

    console.log('✅ Google Auth Successful:', userInfo);

    // For testing: redirect to a page with the token in query (not secure for production)
    // res.redirect(`/send-mail?email=${userInfo.email}&refreshToken=${userInfo.refreshToken}`);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ OAuth error:', err.message);
    res.status(500).send('Authentication Failed');
  }
});

module.exports = router;
