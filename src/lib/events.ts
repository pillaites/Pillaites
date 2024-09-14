// src/lib/events.ts

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
  }
  
  export const events: Event[] = [
    {
      id: '1',
      title: 'Event One',
      description: 'Description for Event One',
      date: '2024-09-20T10:00:00Z',
    },
    {
      id: '2',
      title: 'Event Two',
      description: 'Description for Event Two',
      date: '2024-09-25T14:00:00Z',
    },
    // Add more events as needed
  ];
  
  console.log('Events loaded:', events.length);
