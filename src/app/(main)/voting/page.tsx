'use client';

import { useState, useEffect } from 'react';
import { UploadThing } from 'uploadthing';  // Import UploadThing component

interface Candidate {
  id: string;  // Adjust as per actual API response field
  name: string;
  imageUrl?: string;  // Add imageUrl to Candidate interface
}

interface VotingPageProps {
  params: { electionId: string };  // Adjusted prop definition to match dynamic routing
}

export default function VotingPage({ params }: VotingPageProps) {
  const { electionId } = params;  // Destructure electionId from params
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [newCandidateName, setNewCandidateName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);  // Add state for image file

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

  const handleAddCandidate = async () => {
    if (!newCandidateName.trim()) {
      setMessage("Candidate name cannot be empty.");
      return;
    }

    // Handle image upload if image is selected
    let imageUrl: string | undefined;
    if (image) {
      try {
        const formData = new FormData();
        formData.append('file', image);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || "Error uploading image.");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;  // Assuming the response contains the URL
      } catch (error: any) {
        setMessage(error.message || "Error uploading image.");
        return;
      }
    }

    try {
      const res = await fetch(`/api/elections/${electionId}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCandidateName,
          imageUrl,  // Include imageUrl in the request body
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error adding candidate.");
      }

      const newCandidate = await res.json();
      setCandidates((prev) => [...prev, newCandidate]);
      setNewCandidateName("");  // Clear the input after adding
      setImage(null);  // Clear the image file after adding
      setMessage("Candidate added successfully!");
    } catch (error: any) {
      setMessage(error.message || "Error adding candidate.");
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
              {candidate.imageUrl && <img src={candidate.imageUrl} alt={candidate.name} width={100} />}  {/* Display candidate image */}
            </label>
          </div>
        ))
      ) : (
        <p>No candidates available.</p>
      )}
      <button onClick={handleVote}>Cast Vote</button>

      <h2>Add a New Candidate</h2>
      <input
        type="text"
        value={newCandidateName}
        onChange={(e) => setNewCandidateName(e.target.value)}
        placeholder="Enter candidate name"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}  // Handle image file selection
      />
      <button onClick={handleAddCandidate}>Add Candidate</button>

      {message && <p>{message}</p>}
    </div>
  );
}
