import { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return (
    <div className="container">
      <Chat />
      
      {/* Inline styles using Next.js specific `style jsx` */}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 16px;
          background-color: #f0f0f0;
          box-sizing: border-box;
        }

        /* Responsive design adjustments */
        @media (max-width: 768px) {
          .container {
            padding: 8px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 4px;
          }
        }
      `}</style>
    </div>
  );
}
