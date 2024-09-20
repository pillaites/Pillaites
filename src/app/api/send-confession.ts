import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const sendConfession = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, confession } = req.body;

  // Validate confession field
  if (!confession) {
    return res.status(400).json({ message: 'Confession is required' });
  }

  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Unify the environment variable
      pass: process.env.EMAIL_PASS, // Use the unified password variable
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVING_EMAIL || 'recipient@example.com', // Use the env variable or fallback
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
  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Confession sent successfully' });
  } catch (error) {
    console.error('Error sending confession:', error);
    return res.status(500).json({ message: 'Failed to send confession', error });
  }
};

export default sendConfession;
