import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Candidate {
  id: number;
  name: string;
  votes: number;
}

export default function Voting() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [newCandidateName, setNewCandidateName] = useState("");

  // Function to handle candidate registration
  const handleRegisterCandidate = () => {
    if (!newCandidateName) return;
    
    const newCandidate: Candidate = {
      id: candidates.length + 1,
      name: newCandidateName,
      votes: 0,
    };

    setCandidates([...candidates, newCandidate]);
    setNewCandidateName(""); // Clear the input field
  };

  // Function to handle voting
  const handleVote = (id: number) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === id
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    ));
  };

  return (
    <div className="space-y-5">
      {/* Register New Candidate */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-center text-xl font-bold">Register as Candidate</h2>
        <div className="flex gap-3 mt-3">
          <input
            type="text"
            placeholder="Enter candidate name"
            className="input input-bordered w-full"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
          />
          <Button variant="primary" onClick={handleRegisterCandidate}>
            Register
          </Button>
        </div>
      </div>

      {/* Voting Section */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-center text-xl font-bold">Vote for Candidates</h2>
        {candidates.length > 0 ? (
          <div className="mt-5 space-y-3">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between">
                <span>{candidate.name}</span>
                <span>Votes: {candidate.votes}</span>
                <Button variant="ghost" onClick={() => handleVote(candidate.id)}>
                  Vote
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-5">No candidates yet. Register to participate!</p>
        )}
      </div>
    </div>
  );
}
