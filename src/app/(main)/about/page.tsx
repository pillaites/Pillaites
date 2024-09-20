import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="p-5 max-w-2xl mx-auto bg-card text-foreground rounded-lg shadow-md font-sans">
      <h1 className="text-3xl font-semibold mb-4">About Pillaites</h1>
      <p className="mb-4">
        <strong>Welcome to Pillaites</strong> – a vibrant and inclusive social platform created exclusively for the students and alumni of Pillai College. Our mission is to empower students and graduates by offering a dedicated space to connect, collaborate, and thrive together.
      </p>
      <p className="mb-4">
        At Pillaites, we believe in fostering meaningful relationships that extend beyond the classroom. Whether you’re looking to form study groups, share experiences, organize events, or simply stay in touch with your peers, Pillaites has all the tools you need to make those connections seamless and fun.
      </p>
      <h2 className="text-2xl font-semibold mt-5 mb-2">Why Pillaites?</h2>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Tailored for Pillai College:</strong> We understand the unique needs of our students and alumni. Pillaites is designed specifically to bring our community closer, offering features that matter most to you.</li>
        <li><strong>Group Chats & Project Spaces:</strong> Collaborate with your peers through our interactive group chats and dedicated project spaces, where you can discuss, plan, and work on college assignments or projects effortlessly.</li>
        <li><strong>Event Coordination:</strong> Organize and participate in college events, reunions, and meetups with ease. Stay updated on what’s happening around the campus or in the alumni network.</li>
        <li><strong>Women Safety Feature:</strong> We are committed to creating a safe space for all our users. Our platform includes an anonymous complaint system for women to report any inappropriate behavior, ensuring a secure and respectful environment.</li>
        <li><strong>Mental Health Support:</strong> Need a helping hand? Our AI-integrated chatbot is here to provide you with mental support whenever you need it. Your well-being is our priority.</li>
      </ul>
      <p>
        Join Pillaites today and become part of a thriving community that’s all about connection, collaboration, and creating lifelong bonds. Let’s build a network that grows with us!
      </p>
    </div>
  );
};

export default AboutPage;
