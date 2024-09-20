import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const sendConfession = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, message } = req.body;

  // Create a transporter with logging and debugging enabled
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Confession sent!' });
  } catch (error) {
    console.error('Error sending email:', error);  // Log the error details
    return res.status(500).json({ message: 'Failed to send confession', error });
  }
};

export default sendConfession;
