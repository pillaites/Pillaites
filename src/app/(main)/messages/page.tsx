import Chat from "./Chat";

// Exporting metadata in a Server Component
export const metadata = {
  title: "Messages",
};

// Page component, marked as Server Component (no "use client")
export default function MessagesPage() {
  return <ChatContainer />;
}
