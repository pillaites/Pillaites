// /api/send-confession.js

import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }

    // Create a transporter object using SMTP transport.
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Using Gmail SMTP here as an example
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Gmail or other SMTP provider email
        pass: process.env.SMTP_PASSWORD, // Your email account password or app-specific password
      },
    });

    try {
      // Send email using the transporter object
      await transporter.sendMail({
        from: process.env.SMTP_USER, // Sender email address
        to: 'recipient@example.com', // The recipient email address
        subject: 'New Confession',
        text: `Confession from ${name}: ${message}`,
        html: `<strong>Confession from ${name}:</strong><p>${message}</p>`,
      });

      return res.status(200).json({ message: 'Confession sent successfully' });
    } catch (error) {
      console.error('Error sending confession email:', error);
      return res.status(500).json({ error: 'Failed to send confession' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
