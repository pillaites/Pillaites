'use client';

import { useState, useEffect } from 'react';

interface Candidate {
  id: string;  // Adjust as per actual API response field
  name: string;
}

interface VotingPageProps {
  params: { electionId: string };  // Adjusted prop definition to match dynamic routing
}

export default function VotingPage({ params }: VotingPageProps) {
  const { electionId } = params;  // Destructure electionId from params
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

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
