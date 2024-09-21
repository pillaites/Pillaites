"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function ImageVoting() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [voteRegistered, setVoteRegistered] = useState(false);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setVoteRegistered(false);
  };

  const handleVote = () => {
    if (selectedImage !== null) {
      setVoteRegistered(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex space-x-4 mb-4">
        {[0, 1].map((index) => (
          <div
            key={index}
            className={`relative cursor-pointer border border-border rounded-lg transition-all ${
              selectedImage === index ? 'ring-4 ring-primary' : ''
            }`}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={`/api/placeholder/200/200`}
              alt={`Voting option ${index + 1}`}
              className="w-40 h-40 rounded-full object-cover"
            />
            {selectedImage === index && (
              <CheckCircle className="absolute top-0 right-0 text-primary" size={24} />
            )}
          </div>
        ))}
      </div>
      <Button
        onClick={handleVote}
        disabled={selectedImage === null}
        className="mb-4 bg-primary text-primary-foreground hover:bg-accent transition"
      >
        Vote
      </Button>
      {voteRegistered && (
        <div className="flex items-center text-primary">
          <CheckCircle className="mr-2" size={20} />
          <span>Vote registered</span>
        </div>
      )}
      {selectedImage === null && !voteRegistered && (
        <div className="flex items-center text-secondary">
          <AlertCircle className="mr-2" size={20} />
          <span>Please select an image to vote</span>
        </div>
      )}
    </div>
  );
}
