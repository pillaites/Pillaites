import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, profilePhoto } = req.body;

    try {
      // Add the candidate to the database
      await prisma.candidate.create({
        data: {
          username,
          profilePhoto, // Ensure this matches the schema definition
        },
      });
      res.status(200).json({ message: 'Candidate added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add candidate' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
