import { useState } from 'react';

const VoteForm = () => {
  const [userId, setUserId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [electionId, setElectionId] = useState('');

  const handleVote = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, candidateId, electionId }),
    });

    if (response.ok) {
      alert('Vote cast successfully!');
      setUserId('');
      setCandidateId('');
      setElectionId('');
    } else {
      alert('Failed to cast vote');
    }
  };

  return (
    <form onSubmit={handleVote}>
      <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      <input type="text" placeholder="Candidate ID" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} required />
      <input type="text" placeholder="Election ID" value={electionId} onChange={(e) => setElectionId(e.target.value)} required />
      <button type="submit">Vote</button>
    </form>
  );
};

export default VoteForm;
