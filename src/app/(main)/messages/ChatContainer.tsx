"use client";

import Chat from "./Chat";

export default function ChatContainer() {
  return (
    <div className="container">
      <Chat />
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 16px;
          background-color: #f0f0f0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
}
