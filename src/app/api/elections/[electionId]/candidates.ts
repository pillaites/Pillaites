
import { prisma } from '@prisma/client';

export default async function handler(req, res) {
  const { electionId } = req.query;

  if (req.method === 'POST') {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Candidate name is required' });
    }

    try {
      const newCandidate = await prisma.candidate.create({
        data: {
          name,
          electionId: parseInt(electionId, 10),  // Adjust based on how electionId is stored
        },
      });

      res.status(201).json(newCandidate);
    } catch (error) {
      res.status(500).json({ error: 'Error adding candidate' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
