// /api/send-confession.js

import { NextApiRequest, NextApiResponse } from 'next';
import sendgrid from '@sendgrid/mail';

// Set your SendGrid API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }

    try {
      await sendgrid.send({
        to: 'recipient@example.com', // Change this to the recipient email address
        from: 'your-email@example.com', // Change this to the verified sender email
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
