import { useState } from 'react';

const CandidateForm = () => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [electionId, setElectionId] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, party, profilePhoto, electionId }),
    });

    if (response.ok) {
      alert('Candidate enrolled successfully!');
      setName('');
      setParty('');
      setProfilePhoto('');
      setElectionId('');
    } else {
      alert('Failed to enroll candidate');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Party" value={party} onChange={(e) => setParty(e.target.value)} required />
      <input type="text" placeholder="Profile Photo URL" value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} />
      <input type="text" placeholder="Election ID" value={electionId} onChange={(e) => setElectionId(e.target.value)} required />
      <button type="submit">Enroll Candidate</button>
    </form>
  );
};

export default CandidateForm;
