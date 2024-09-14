import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  username: string;
  name: string;
  photoUrl: string;
}

const VotingSystemPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [votedUser, setVotedUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ username: '', name: '', photoUrl: '' });

  useEffect(() => {
    // Fetch users from an API or load from local storage
    const fetchUsers = async () => {
      // Simulating API call
      const mockUsers: User[] = [
        { id: '1', username: 'user1', name: 'User One', photoUrl: '/api/placeholder/100/100' },
        { id: '2', username: 'user2', name: 'User Two', photoUrl: '/api/placeholder/100/100' },
      ];
      setUsers(mockUsers);
    };

    fetchUsers();
  }, []);

  const handleVote = (userId: string) => {
    if (!votedUser) {
      setVotedUser(userId);
    }
  };

  const handleEnroll = () => {
    if (newUser.username && newUser.name && newUser.photoUrl) {
      const newUserWithId: User = {
        ...newUser,
        id: Date.now().toString(),
      };
      setUsers([...users, newUserWithId]);
      setNewUser({ username: '', name: '', photoUrl: '' });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Voting System</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Enroll New User</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Photo URL"
            value={newUser.photoUrl}
            onChange={(e) => setNewUser({ ...newUser, photoUrl: e.target.value })}
            className="border p-2 rounded"
          />
          <button onClick={handleEnroll} className="bg-blue-500 text-white px-4 py-2 rounded">
            Enroll
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Vote for a User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded">
              <Image src={user.photoUrl} alt={user.name} width={100} height={100} className="mb-2 rounded-full" />
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">@{user.username}</p>
              <button
                onClick={() => handleVote(user.id)}
                disabled={votedUser !== null}
                className={`mt-2 px-4 py-2 rounded ${
                  votedUser === user.id
                    ? 'bg-green-500 text-white'
                    : votedUser
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {votedUser === user.id ? 'Voted' : 'Vote'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingSystemPage;
