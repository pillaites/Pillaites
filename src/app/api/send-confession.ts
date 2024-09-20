import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

// Replace with your client ID, client secret, and refresh token
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const sendConfession = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, message } = req.body;

  // Create an OAuth2 client
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const { token: accessToken } = await oauth2Client.getAccessToken();

    // Create a transporter using SMTP configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Gmail SMTP server
      port: 465,              // SSL port
      secure: true,           // Use SSL
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
      logger: true,  // Enable logging
      debug: true,   // Enable debugging output
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'recipient@example.com', // Replace with actual recipient
      subject: 'New Confession',
      text: `Name: ${name}\nMessage: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Confession sent!' });

  } catch (error) {
    console.error('Error sending email:', error);  // Log the error details
    return res.status(500).json({ message: 'Failed to send confession', error: (error as Error).message });
  }
};

export default sendConfession;
