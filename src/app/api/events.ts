// src/app/api/events.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = [
      {
        id: '1',
        title: 'Event One',
        description: 'Description for Event One',
        date: new Date('2024-09-20T10:00:00Z').toISOString(), // ISO string representation
      },
      {
        id: '2',
        title: 'Event Two',
        description: 'Description for Event Two',
        date: new Date('2024-09-25T14:00:00Z').toISOString(), // ISO string representation
      },
    ];

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return new NextResponse('Failed to fetch events.', { status: 500 });
  }
}
