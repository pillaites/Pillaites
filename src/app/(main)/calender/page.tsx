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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calendar</h1>

      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="bg-blue-500 text-white px-4 py-2 rounded">
          Previous Month
        </button>
        <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="bg-blue-500 text-white px-4 py-2 rounded">
          Next Month
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {daysInMonth.map(day => (
          <div
            key={day.toISOString()}
            className={`p-2 border ${
              isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-100'
            } ${isSameDay(day, new Date()) ? 'border-blue-500' : ''}`}
          >
            <div className="text-right">{format(day, 'd')}</div>
            {getEventsForDate(day).map(event => (
              <div key={event.id} className="text-xs bg-blue-100 p-1 mt-1 rounded">
                {event.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
        <ul>
          {getUpcomingEvents().map(event => (
            <li key={event.id} className="mb-2">
              <div className="font-semibold">{event.title}</div>
              <div>{format(new Date(event.date), 'MMMM d, yyyy')}</div>
              <div className="text-sm text-gray-600">{event.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarPage;
