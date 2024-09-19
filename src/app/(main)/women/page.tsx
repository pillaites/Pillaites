"use client";

import React, { useState } from 'react';

const ConfessionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confession: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/sendConfession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatusMessage('Your confession has been sent successfully.');
        setFormData({ name: '', email: '', confession: '' });
      } else {
        setStatusMessage('There was an error sending your confession. Please try again.');
      }
    } catch (err) {
      setStatusMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Share Your Experience</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name (Optional)</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email (Optional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="confession">Your Confession</label>
          <textarea
            id="confession"
            name="confession"
            rows={6}
            value={formData.confession}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default ConfessionForm;
