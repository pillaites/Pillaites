// pages/api/election/current.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";  // Correct - default import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch the current active election (filter by date)
    const currentElection = await prisma.election.findFirst({
      where: {
        startDate: {
          lte: new Date(), // Election should have started
        },
        endDate: {
          gte: new Date(), // Election should not be ended
        },
      },
      include: {
        candidates: true, // Include candidates
      },
    });

    if (!currentElection) {
      return res.status(404).json({ message: "No active election found." });
    }

    return res.status(200).json(currentElection);
  } catch (error) {
    console.error("Error fetching election:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
