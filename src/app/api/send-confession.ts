import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const sendConfession = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, confession } = req.body;

  if (!confession) {
    return res.status(400).json({ message: 'Confession is required' });
  }

  try {
    // Create a Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail App Password or OAuth token
      },
    });

    // Email message options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECEIVING_EMAIL, // Email to send confessions to
      subject: 'New Confession Received',
      text: `
        New confession received:

        Name: ${name || 'Anonymous'}
        Email: ${email || 'Not provided'}

        Confession:
        ${confession}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Confession sent successfully' });
  } catch (error) {
    console.error('Error sending confession:', error);
    return res.status(500).json({ message: 'Failed to send confession' });
  }
};

export default sendConfession;
