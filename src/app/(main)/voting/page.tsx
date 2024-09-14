'use client'; 

import { useState, useEffect } from 'react';
import FileUpload from './FileUpload';  // Adjust import path

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

interface VotingPageProps {
  params: { electionId: string };
}

export default function VotingPage({ params }: VotingPageProps) {
  const { electionId } = params;
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserImageUrl, setNewUserImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`/api/users`);
        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await res.json();
        setUsers(data.results);
      } catch (error: any) {
        setMessage(error.message || "Error fetching users.");
      }
    }

    fetchUsers();
  }, []);

  const handleVote = async () => {
    if (!selectedUser) {
      setMessage("Please select a user.");
      return;
    }

    try {
      const res = await fetch(`/api/elections/${electionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedUser }),
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

  const handleAddUser = async () => {
    if (!newUserName.trim()) {
      setMessage("User name cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUserName,
          avatarUrl: newUserImageUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error adding user.");
      }

      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setNewUserName("");
      setNewUserImageUrl(null);
      setMessage("User added successfully!");
    } catch (error: any) {
      setMessage(error.message || "Error adding user.");
    }
  };

  return (
    <div>
      <h1>Vote for Your Favorite User</h1>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id}>
            <label>
              <input
                type="radio"
                name="user"
                value={user.id}
                onChange={() => setSelectedUser(user.id)}
              />
              {user.displayName || user.username}
              {user.avatarUrl && <img src={user.avatarUrl} alt={user.username} width={100} />} {/* Display user image */}
            </label>
          </div>
        ))
      ) : (
        <p>No users available.</p>
      )}
      <button onClick={handleVote}>Cast Vote</button>

      <h2>Add a New User</h2>
      <input
        type="text"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        placeholder="Enter user name"
      />
      <FileUpload onUpload={setNewUserImageUrl} /> {/* Use FileUpload component */}
      <button onClick={handleAddUser}>Add User</button>

      {message && <p>{message}</p>}
    </div>
  );
}
