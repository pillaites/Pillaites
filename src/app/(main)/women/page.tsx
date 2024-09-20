"use client";

import React, { useState } from 'react';

const ConfessionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/send-confession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send confession');
      }

      setFormData({ name: '', message: '' });
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="text-3xl font-semibold mb-4">Confession Form</h1>

      <button
        onClick={toggleDarkMode}
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Confession sent successfully!</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-lg shadow-lg bg-card">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-2 text-sm font-medium">Message:</label>
          <input
            type="text"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground font-bold rounded-md hover:bg-accent transition-colors duration-300"
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ConfessionForm;
