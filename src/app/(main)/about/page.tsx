import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-5 bg-card text-foreground rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-semibold mb-5">About Pillaites</h1>
      <p className="mb-4">
        <strong>Welcome to Pillaites</strong> – a vibrant and inclusive social platform designed exclusively for the students and alumni of Pillai College. Our mission is to empower our community by fostering connections, collaboration, and growth.
      </p>
      <p className="mb-4">
        At Pillaites, we believe in the power of meaningful relationships that extend beyond the classroom. Whether you're looking to form study groups, share experiences, organize events, or simply stay in touch with your peers, our platform offers the tools you need to enhance your college experience.
      </p>
      <h2 className="text-2xl font-semibold mt-5 mb-3">Why Choose Pillaites?</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Tailored for Our Community:</strong> Pillaites is built specifically for Pillai College, addressing the unique needs and interests of our students and alumni.
        </li>
        <li>
          <strong>Collaborative Spaces:</strong> Create and join group chats and project spaces to collaborate on assignments and share resources.
        </li>
        <li>
          <strong>Event Coordination:</strong> Easily organize and participate in college events, reunions, and social gatherings.
        </li>
        <li>
          <strong>Safety First:</strong> We prioritize user safety with features like an anonymous reporting system for respectful and secure interactions.
        </li>
        <li>
          <strong>Mental Health Support:</strong> Access our AI-driven chatbot for mental health resources and support whenever needed.
        </li>
      </ul>
      <p>
        Join us today and become part of a vibrant community that believes in the power of connection and collaboration. Together, let's create lasting bonds and unforgettable memories!
      </p>
    </div>
  );
};

export default AboutPage;
