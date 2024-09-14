'use client';
// src/app/(main)/calendar/page.tsx

import { useEffect, useState } from 'react';

interface Event {
  date: string; // Use string if date is represented as ISO string
  id: string;
  title: string;
  description: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Event[] = await response.json();
        setEvents(data.map(event => ({
          ...event,
          date: new Date(event.date).toISOString() // Ensure date is in string format
        })));
      } catch (error) {
        setError('Failed to fetch events.');
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Upcoming Events</h1>
      {error && <p>{error}</p>}
      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
