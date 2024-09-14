"use client";  
import React, { useState } from 'react'; 
import { Button } from 'your-ui-library'; 

const Voting: React.FC = () => {
    const [newCandidateName, setNewCandidateName] = useState('');

    const handleRegisterCandidate = () => {
        // Your registration logic here
        console.log('Candidate Registered:', newCandidateName);
    };

    return (
        <div>
            <input
                type="text"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                placeholder="Enter candidate name"
            />
            <Button variant="default" onClick={handleRegisterCandidate}>
                Register
            </Button>
        </div>
    );
};

export default Voting;
