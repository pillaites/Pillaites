import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Candidate = {
  name: string;
  party: string;
  electionId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Extract the data from the request body
    const { name, party, electionId }: Candidate = req.body;

    // Validate the data
    if (!name || !party || !electionId) {
      return res.status(400).json({ error: 'Name, party, and electionId are required.' });
    }

    try {
      // Create a new candidate in the database
      const candidate = await prisma.candidate.create({
        data: {
          name,
          party,
          electionId,
        },
      });

      // Respond with the created candidate
      return res.status(201).json(candidate);
    } catch (error) {
      // Handle any errors that occur during database operations
      console.error('Error creating candidate:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
