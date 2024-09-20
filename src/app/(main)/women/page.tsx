"use client";

import React, { useState } from 'react';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    report: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send report');
      }

      setFormData({ name: '', report: '' });
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 p-4">
      <h1 className="text-4xl font-semibold mb-8 text-center">Report Form</h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">Report submitted successfully!</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-6xl bg-card p-6 rounded-xl shadow-lg">
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 text-lg font-medium">Your Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-4 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="report" className="block mb-2 text-lg font-medium">Report Details:</label>
          <textarea
            id="report"
            name="report"
            value={formData.report}
            onChange={handleInputChange}
            required
            rows={10}
            className="w-full p-4 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-accent transition-colors duration-300"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
