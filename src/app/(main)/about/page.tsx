import React from 'react';
import Image from 'next/image';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const teamMembers = [
  { name: 'Aditya Nalawde', title: 'The Pixel Wizard', image: './team/aditya.png', socials: { linkedin: '#', twitter: '#', github: '#' }, royalPost: 'Lord of the Layouts' },
  { name: 'Kandarp', title: 'The Code Whisperer', image: './team/kandarp.png', socials: { linkedin: '#', twitter: '#', github: '#' }, royalPost: 'Duke of Databases' },
  { name: 'Kushal Endait', title: 'The All-Seeing Eye', image: './team/kushal.png', socials: { linkedin: '#', twitter: '#', github: '#' }, royalPost: 'Baron of Bugs' },
  { name: 'Om Patil', title: 'The Chaos Engineer', image: './team/om.png', socials: { linkedin: '#', twitter: '#', github: '#' }, royalPost: 'Prince of Pranks' },
  { name: 'Sangram Khandagle', title: 'The Jack of All Trades', image: './team/sangram.png', socials: { linkedin: '#', twitter: '#', github: '#' }, royalPost: 'Earl of Everything' },
  { name: 'Vaibhavi Shelar', title: 'The Backend Baroness', image: './team/vaibhavi_s.png', socials: { linkedin: '#', twitter: '#', github: '#' }, royalPost: 'Duchess of Data' },
  { name: 'Vaibhavi Mhatre', title: 'The Idea Alchemist', image: './team/vaibhavi_m.png', socials: { linkedin: '#', twitter: '#', github: '#' }, royalPost: 'Countess of Concepts' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-black text-white">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">The Royal Court of Pillaites</h1>
        <p className="max-w-3xl mx-auto text-lg">
          Welcome to the most dysfunctional family in the realm of social media. We're here to pillage your attention and plunder your scrolling time. Resistance is futile, but highly encouraged.
        </p>
      </section>

      <section className="pt-12 pb-24 bg-gray-900">
        <h2 className="text-3xl font-semibold text-center mb-12">Meet the Misfits</h2>
        <div className="flex flex-wrap justify-center gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              style={{ width: '250px', height: '350px' }}
            >
              <div className="relative" style={{ height: '60%' }}>
                <Image
                  src={member.image}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              <div className="p-4 text-center flex flex-col justify-between" style={{ height: '40%' }}>
                <div className="flex flex-col justify-center h-full">
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-gray-400 mb-2">{member.title}</p>
                  <p className="text-xs text-yellow-500 italic">"{member.royalPost}"</p>
                </div>

                <div className="flex justify-center space-x-4 mt-2">
                  <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <FaLinkedin size={20} />
                  </a>
                  <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                    <FaTwitter size={20} />
                  </a>
                  <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
