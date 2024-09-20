// pages/api/vote.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { user } = session;
  const { candidateId } = req.body;

  if (!candidateId) {
    return res.status(400).json({ message: "No candidate selected." });
  }

  try {
    // Check if the user has already voted in the election
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: user.id,
        election: {
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted in this election." });
    }

    // Check if candidate exists in an active election
    const candidate = await prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
      include: {
        election: true,
      },
    });

    if (!candidate || new Date() > candidate.election.endDate || new Date() < candidate.election.startDate) {
      return res.status(400).json({ message: "Invalid candidate or election period." });
    }

    // Submit the vote
    await prisma.vote.create({
      data: {
        userId: user.id,
        candidateId: candidate.id,
        electionId: candidate.electionId,
      },
    });

    return res.status(200).json({ success: true, message: "Vote submitted successfully." });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
