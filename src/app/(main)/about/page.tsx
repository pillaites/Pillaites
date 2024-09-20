import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-5 bg-card text-foreground rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-semibold mb-5">About Pillaites</h1>
      <p className="mb-4">
        Welcome to <strong>Pillaites</strong> – a dynamic and inclusive social platform designed exclusively for the students and alumni of Pillai College. Our mission is to foster a thriving community where connections, collaboration, and support flourish.
      </p>
      <p className="mb-4">
        At Pillaites, we understand the unique experiences and challenges faced by our college community. Whether you're looking to connect with classmates, form study groups, share ideas, or participate in campus events, our platform offers the tools you need to enhance your college experience and maintain lifelong connections.
      </p>
      <h2 className="text-2xl font-semibold mt-5 mb-3">Why Choose Pillaites?</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Tailored for Our Community:</strong> Pillaites is built specifically for Pillai College, addressing the unique needs and interests of our students and alumni.
        </li>
        <li>
          <strong>Collaborative Spaces:</strong> Create and join group chats and project spaces to collaborate on assignments, share resources, and brainstorm ideas with your peers.
        </li>
        <li>
          <strong>Event Management:</strong> Easily organize and participate in college events, reunions, and social gatherings. Stay informed about what's happening on campus and within the alumni network.
        </li>
        <li>
          <strong>Safety First:</strong> We prioritize user safety with features like an anonymous reporting system, ensuring a respectful and secure environment for everyone.
        </li>
        <li>
          <strong>Mental Health Support:</strong> Access our AI-driven chatbot for mental health support and resources, because your well-being is our priority.
        </li>
      </ul>
      <p>
        Join us today and become part of a vibrant community that believes in the power of connection, collaboration, and growth. Together, let's create lasting bonds and unforgettable memories!
      </p>
    </div>
  );
};

export default AboutPage;
