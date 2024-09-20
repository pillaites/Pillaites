import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";  // Importing Prisma client
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure it's a POST request, as voting should not happen via GET
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Retrieve the current session (authenticated user)
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { user } = session;
  const { candidateId } = req.body;

  // Ensure candidateId is provided in the request body
  if (!candidateId) {
    return res.status(400).json({ message: "No candidate selected." });
  }

  try {
    // Check if the user has already voted in an ongoing election
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

    // Verify the candidate exists and is part of an active election
    const candidate = await prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
      include: {
        election: true,
      },
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    const currentDate = new Date();

    if (currentDate > candidate.election.endDate || currentDate < candidate.election.startDate) {
      return res.status(400).json({ message: "Voting is not allowed at this time." });
    }

    // Record the vote
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
