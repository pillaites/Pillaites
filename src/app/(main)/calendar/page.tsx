'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      setEvents(data);
    } catch (error) {
      setError('Error fetching events. Please try again later.');
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
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Calendar</h1>

      {error && <p className="text-red-500">{error}</p>}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-bold text-muted-foreground">
                {day}
              </div>
            ))}
            {daysInMonth.map(day => (
              <div
                key={day.toISOString()}
                className={`p-2 border rounded-lg text-center ${
                  isSameMonth(day, currentDate)
                    ? 'bg-background text-foreground'
                    : 'bg-muted text-muted-foreground'
                } ${isSameDay(day, new Date()) ? 'border-primary font-bold' : 'border-border'}`}
              >
                <div>{format(day, 'd')}</div>
                {getEventsForDate(day).map(event => (
                  <div key={event.id} className="text-xs bg-primary/10 p-1 mt-1 rounded truncate">
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Upcoming Events</h3>
        </CardHeader>
        <CardContent>
          {getUpcomingEvents().length > 0 ? (
            <ul className="space-y-2">
              {getUpcomingEvents().map(event => (
                <li key={event.id} className="bg-muted p-2 rounded">
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{format(new Date(event.date), 'MMMM d, yyyy')}</div>
                  <div className="text-sm">{event.description}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">No upcoming events</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
