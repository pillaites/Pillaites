"use client";

import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { Chat as StreamChat } from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import useInitializeChatClient from "./useInitializeChatClient";

const Voting = () => {
  const chatClient = useInitializeChatClient();
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vote, setVote] = useState("");
  const [votes, setVotes] = useState<string[]>([]);

  const handleVoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVote(event.target.value);
  };

  const handleVoteSubmit = () => {
    if (vote.trim()) {
      setVotes([...votes, vote]);
      setVote("");
    }
  };

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
      <div className="p-4">
        <Typography variant="h4" gutterBottom>
          Voting System
        </Typography>
        <TextField
          label="Enter your vote"
          value={vote}
          onChange={handleVoteChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleVoteSubmit}
        >
          Submit Vote
        </Button>
        <div className="mt-4">
          <Typography variant="h6">Current Votes:</Typography>
          <ul>
            {votes.map((v, index) => (
              <li key={index}>{v}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Voting;
