import { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return (
    <div className="container">
      <Chat />
      
      {/* Inline styles using Next.js specific style jsx */}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 16px;
          background-color: #f0f0f0;
          box-sizing: border-box; /* Ensures padding is included in height calculation */
        }

        @media (max-width: 768px) {
          .container {
            padding: 8px;
            height: auto; /* Adjust height for smaller screens */
          }
        }
      `}</style>
    </div>
  );
}
