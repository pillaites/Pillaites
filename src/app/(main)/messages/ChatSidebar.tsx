import React from 'react';

// Define the props interface for the ChatSidebar component
interface ChatSidebarProps {
  open: boolean; // Determines if the sidebar is open or closed
  onClose: () => void; // Function to handle closing the sidebar
  className?: string; // Optional className for styling
}

// Functional component definition
const ChatSidebar: React.FC<ChatSidebarProps> = ({ open, onClose, className }) => {
  // CSS classes for sidebar based on the open state
  const sidebarClasses = `fixed top-0 right-0 h-full bg-white shadow-lg transition-transform transform ${open ? 'translate-x-0' : 'translate-x-full'} ${className}`;

  return (
    <div className={sidebarClasses}>
      <button
        className="absolute top-4 right-4 p-2 text-gray-500"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="p-4">
        {/* Sidebar content goes here */}
        <h2 className="text-lg font-bold">Chat Sidebar</h2>
        {/* Add more elements as needed */}
      </div>
    </div>
  );
};

export default ChatSidebar;
