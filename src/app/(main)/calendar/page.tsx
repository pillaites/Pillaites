'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: Date;
  description: string;
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.map((event: Event) => ({
        ...event,
        date: new Date(event.date)
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const daysInMonth = getDaysInMonth(currentDate);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  return (
    <div className="container mx-auto p-4 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] dark:bg-[hsl(var(--card))] dark:text-[hsl(var(--foreground))]">
      <h1 className="text-3xl font-bold mb-4 text-[hsl(var(--primary))] dark:text-[hsl(var(--primary))]">Calendar</h1>

      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth} 
          className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded hover:bg-[hsl(var(--primary-foreground))] dark:bg-[hsl(var(--primary))] dark:text-[hsl(var(--primary-foreground))] dark:hover:bg-[hsl(var(--primary-foreground))]"
        >
          Previous Month
        </button>
        <h2 className="text-xl font-semibold text-[hsl(var(--primary))] dark:text-[hsl(var(--primary))]">{format(currentDate, 'MMMM yyyy')}</h2>
        <button 
          onClick={nextMonth} 
          className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded hover:bg-[hsl(var(--primary-foreground))] dark:bg-[hsl(var(--primary))] dark:text-[hsl(var(--primary-foreground))] dark:hover:bg-[hsl(var(--primary-foreground))]"
        >
          Next Month
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-[hsl(var(--primary))] dark:text-[hsl(var(--primary))]">
            {day}
          </div>
        ))}
        {daysInMonth.map(day => (
          <div
            key={day.toISOString()}
            className={`p-4 border rounded-lg ${
              isSameMonth(day, currentDate)
                ? 'bg-[hsl(var(--card))] text-[hsl(var(--primary))]'
                : 'bg-[hsl(var(--popover))] text-[hsl(var(--secondary))]'
            } ${isSameDay(day, new Date()) ? 'border-[hsl(var(--accent))] font-bold' : 'border-[hsl(var(--border))]'}
            dark:bg-[hsl(var(--card))] dark:text-[hsl(var(--primary))] dark:border-[hsl(var(--border))]`}
          >
            <div className="text-right">{format(day, 'd')}</div>
            {getEventsForDate(day).map(event => (
              <div key={event.id} className="text-xs bg-[hsl(var(--popover))] p-1 mt-1 rounded text-[hsl(var(--primary))] dark:bg-[hsl(var(--popover))] dark:text-[hsl(var(--primary))]">
                {event.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-[hsl(var(--card))] p-4 rounded-lg dark:bg-[hsl(var(--card))]">
        <h3 className="text-xl font-semibold mb-2 text-[hsl(var(--primary))] dark:text-[hsl(var(--primary))]">Upcoming Events</h3>
        <ul>
          {getUpcomingEvents().length > 0 ? (
            getUpcomingEvents().map(event => (
              <li key={event.id} className="mb-2 bg-[hsl(var(--popover))] p-2 rounded dark:bg-[hsl(var(--popover))]">
                <div className="font-semibold text-[hsl(var(--primary))] dark:text-[hsl(var(--primary))]">{event.title}</div>
                <div className="text-[hsl(var(--secondary))] dark:text-[hsl(var(--secondary))]">{format(new Date(event.date), 'MMMM d, yyyy')}</div>
                <div className="text-sm text-[hsl(var(--muted))] dark:text-[hsl(var(--muted))]">{event.description}</div>
              </li>
            ))
          ) : (
            <li className="text-center text-[hsl(var(--muted))] dark:text-[hsl(var(--muted))]">No upcoming events</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CalendarPage;
