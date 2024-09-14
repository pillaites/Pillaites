import { useState, useEffect } from 'react';

export default function VotingPage({ electionId }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCandidates() {
      const res = await fetch(`/api/elections/${electionId}`);
      const data = await res.json();
      setCandidates(data.results);
    }
    fetchCandidates();
  }, [electionId]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      setMessage("Please select a candidate.");
      return;
    }

    const res = await fetch(`/api/elections/${electionId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ candidateId: selectedCandidate }),
    });

    if (res.ok) {
      setMessage("Vote cast successfully!");
    } else {
      const data = await res.json();
      setMessage(data.error || "Error casting vote.");
    }
  };

  return (
    <div>
      <h1>Vote for your favorite candidate</h1>
      {candidates.map(candidate => (
        <div key={candidate.candidateId}>
          <input
            type="radio"
            value={candidate.candidateId}
            onChange={() => setSelectedCandidate(candidate.candidateId)}
          />
          {candidate.candidateName}
        </div>
      ))}
      <button onClick={handleVote}>Cast Vote</button>
      {message && <p>{message}</p>}
    </div>
  );
}
