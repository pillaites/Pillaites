'use client';

import { useState, useEffect } from 'react';

interface Candidate {
  id: string;      // Assuming `id` is the candidate's unique identifier
  name: string;    // Assuming `name` is the candidate's display name
}

interface VotingPageProps {
  electionId: string;
}

export default function VotingPage({ electionId }: VotingPageProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  // Fetch the candidates for the election
  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch(`/api/elections/${electionId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch candidates.");
        }
        const data = await res.json();
        setCandidates(data.results);
      } catch (error: any) {
        setMessage(error.message || "Error fetching candidates.");
      }
    }

    fetchCandidates();
  }, [electionId]);

  // Handle voting for a selected candidate
  const handleVote = async () => {
    if (!selectedCandidate) {
      setMessage("Please select a candidate.");
      return;
    }

    try {
      const res = await fetch(`/api/elections/${electionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidateId: selectedCandidate }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error casting vote.");
      }

      setMessage("Vote cast successfully!");
    } catch (error: any) {
      setMessage(error.message || "Error casting vote.");
    }
  };

  return (
    <div>
      <h1>Vote for your favorite candidate</h1>
      {candidates.length > 0 ? (
        candidates.map((candidate) => (
          <div key={candidate.id}>
            <label>
              <input
                type="radio"
                name="candidate"
                value={candidate.id}
                onChange={() => setSelectedCandidate(candidate.id)}
              />
              {candidate.name}
            </label>
          </div>
        ))
      ) : (
        <p>No candidates available.</p>
      )}
      <button onClick={handleVote}>Cast Vote</button>
      {message && <p>{message}</p>}
    </div>
  );
}
