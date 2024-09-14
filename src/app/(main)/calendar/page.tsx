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
    <div className="container mx-auto p-4 bg-yellow-50">
      <h1 className="text-3xl font-bold mb-4 text-yellow-800">Calendar</h1>

      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
          Previous Month
        </button>
        <h2 className="text-xl font-semibold text-yellow-800">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
          Next Month
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-yellow-800">
            {day}
          </div>
        ))}
        {daysInMonth.map(day => (
          <div
            key={day.toISOString()}
            className={`p-2 border rounded ${
              isSameMonth(day, currentDate)
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-yellow-50 text-yellow-600'
            } ${isSameDay(day, new Date()) ? 'border-yellow-500 font-bold' : 'border-yellow-200'}`}
          >
            <div className="text-right">{format(day, 'd')}</div>
            {getEventsForDate(day).map(event => (
              <div key={event.id} className="text-xs bg-yellow-200 p-1 mt-1 rounded text-yellow-800">
                {event.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-yellow-800">Upcoming Events</h3>
        <ul>
          {getUpcomingEvents().map(event => (
            <li key={event.id} className="mb-2 bg-yellow-50 p-2 rounded">
              <div className="font-semibold text-yellow-800">{event.title}</div>
              <div className="text-yellow-600">{format(new Date(event.date), 'MMMM d, yyyy')}</div>
              <div className="text-sm text-yellow-700">{event.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarPage;
