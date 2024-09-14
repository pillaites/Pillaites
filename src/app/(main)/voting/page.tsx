import { useState } from 'react';
import { NextPage } from 'next';
import CandidateForm from '../components/CandidateForm';
import VoteForm from '../components/VoteForm';

const HomePage: NextPage = () => {
  const [view, setView] = useState<'candidate' | 'vote'>('candidate');

  const handleViewChange = (newView: 'candidate' | 'vote') => {
    setView(newView);
  };

  return (
    <div>
      <h1>Election App</h1>
      
      <div>
        <button onClick={() => handleViewChange('candidate')}>Enroll Candidate</button>
        <button onClick={() => handleViewChange('vote')}>Vote</button>
      </div>
      
      {view === 'candidate' && (
        <div>
          <h2>Enroll Candidate</h2>
          <CandidateForm />
        </div>
      )}
      
      {view === 'vote' && (
        <div>
          <h2>Vote for a Candidate</h2>
          <VoteForm />
        </div>
      )}
    </div>
  );
};

export default HomePage;
