// page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Election {
  id: string;
  title: string;
  description?: string;
  candidates: Candidate[];
  startDate: string;
  endDate: string;
}

interface Candidate {
  id: string;
  name: string;
  party: string;
  profilePhoto?: string;
}

interface VoteResponse {
  success: boolean;
  message: string;
}

export default function ElectionPage() {
  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Fetch election data when component loads
  useEffect(() => {
    const fetchElection = async () => {
      try {
        const response = await axios.get("/api/election/current"); // Adjust API endpoint
        setElection(response.data);
      } catch (error) {
        console.error("Error fetching election:", error);
      }
    };

    fetchElection();
  }, []);

  // Handle enrollment
  const handleEnroll = async () => {
    try {
      const response = await axios.post("/api/election/enroll"); // Adjust API endpoint
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  // Handle voting
  const handleVote = async () => {
    if (!selectedCandidate) {
      setMessage("Please select a candidate to vote for.");
      return;
    }

    try {
      const response = await axios.post<VoteResponse>("/api/vote", {
        candidateId: selectedCandidate,
      });

      if (response.data.success) {
        setHasVoted(true);
        setMessage("Thank you for voting!");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  if (!election) {
    return <p>Loading election data...</p>;
  }

  return (
    <div className="election-page">
      <h1>{election.title}</h1>
      {election.description && <p>{election.description}</p>}

      {/* Enroll Button */}
      <button onClick={handleEnroll} disabled={hasVoted}>
        Enroll in Election
      </button>

      {/* List of candidates */}
      <h2>Candidates</h2>
      {election.candidates.map((candidate) => (
        <div key={candidate.id} className="candidate">
          <img
            src={candidate.profilePhoto || "/default-avatar.png"}
            alt={candidate.name}
            width={100}
            height={100}
          />
          <h3>{candidate.name}</h3>
          <p>Party: {candidate.party}</p>
          <input
            type="radio"
            name="candidate"
            value={candidate.id}
            onChange={() => setSelectedCandidate(candidate.id)}
            disabled={hasVoted}
          />
        </div>
      ))}

      {/* Submit Vote Button */}
      <button onClick={handleVote} disabled={hasVoted}>
        {hasVoted ? "You have already voted" : "Submit Vote"}
      </button>

      {/* Message */}
      {message && <p>{message}</p>}
    </div>
  );
}
